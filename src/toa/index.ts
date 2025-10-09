import { Browser, launch } from 'puppeteer-core'
import { MailService, MongoService } from '../services'
import { ENV, PUPPETEER_CONFIG } from '@/config'
import {
    FilterSelector,
    LoginService,
    OrderDataFetcher,
    OrderDetailDataFetcher,
    ProvidersScraper,
    SendData,
} from './services'
import { findAndRemoveDuplicates, getFormattedDateRange } from './utils'
import { ScrapingSystem } from 'logiflowerp-sdk'

export async function BootstrapTOA() {
    console.info(`🚀 Inicio scraper TOA...`)
    try {
        const mongoService = new MongoService()

        let targetToa
        try {
            targetToa = await mongoService.getScrapingCredentialTOA()
        } finally {
            await mongoService.close()
        }

        let requestNumberTTL
        try {
            requestNumberTTL = await mongoService.getToaRequestNumberTTL()
        } finally {
            await mongoService.close()
        }

        let companies
        try {
            companies = await mongoService.getActiveCompanies()
            companies = companies.filter(e => e.scrapingTargets.some(el => el.system === ScrapingSystem.TOA))
        } finally {
            await mongoService.close()
        }

        let employees
        try {
            employees = await mongoService.getPersonelCompanies(companies)
        } finally {
            await mongoService.close()
        }

        const mapaEmployees = new Set(employees.flatMap(e => e.resourceSystem.filter(el => el.system === ScrapingSystem.TOA).map(e => e.resource_id)))

        let browser: Browser | null = null

        try {
            browser = await launch(PUPPETEER_CONFIG)

            const context = await browser.createBrowserContext()
            const page = await context.newPage()

            try {
                const loginService = new LoginService(page)
                await loginService.login(targetToa)

                const filter = new FilterSelector(page)
                await filter.selectAllChildrenData()

                const ids: string[] = []
                const scraper = new ProvidersScraper(page)
                await scraper.getProvidersId(ids)

                const orderFetcher = new OrderDataFetcher(page)
                const mapaRequestNumber = new Set(requestNumberTTL.map(e => e.numero_de_peticion))
                const data: any[] = []

                for (let i = 0; i <= ENV.TOA_LOOKBACK_DAYS; i++) {
                    const fec = new Date()
                    fec.setDate(fec.getDate() - i)
                    const date = getFormattedDateRange(fec)

                    for (const [j, id] of ids.entries()) {
                        await orderFetcher.getOrderData(
                            targetToa,
                            mapaRequestNumber,
                            mapaEmployees,
                            id,
                            data,
                            date,
                            i,
                            j,
                            ids.length
                        )
                    }
                }

                const orderDetailFetcher = new OrderDetailDataFetcher(page)
                await orderDetailFetcher.getOrderData(targetToa, data)

                const _data = findAndRemoveDuplicates(data)

                await new SendData().exec(_data)

                console.log(`✅ Scraping TOA completado`)
                // Enviar webhook para iniciar resumen siempre y cuando sean menos de 10pm

                //#region WebHook
                const url = `${ENV.HOST_API}/processes/toaorder/update-consumed`
                const response = await fetch(url, { method: 'POST', headers: { 'Authorization': `Bearer ${ENV.TOKEN}` } })
                if (!response.ok) {
                    const errorText = await response.text()
                    throw new Error(`Error ${response.status}: ${errorText}`)
                }
                //#endregion WebHook
            } finally {
                if (ENV.NODE_ENV !== 'development') {
                    await context.close()
                }
            }
        } finally {
            if (browser && ENV.NODE_ENV !== 'development') {
                await browser.close()
            }
        }
    } catch (error) {
        try {
            console.error(error)
            const instance = new MailService()
            await instance.send(ENV.DEVS_EMAILS, 'Error en scraper TOA', (error as Error).message)
        } catch (error) {
            console.error('Erros al enviar Mail (0)', error)
        }
    }
}
