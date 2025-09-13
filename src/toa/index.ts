import { Browser, launch } from 'puppeteer-core'
import { MongoService } from '../services'
import { ENV, PUPPETEER_CONFIG } from '@/config'
import {
    FilterSelector,
    GroupOrdersByCompany,
    LoginService,
    OrderDataFetcher,
    ProvidersScraper,
    SaveOrders
} from './services'
import { ScrapingSystem } from 'logiflowerp-sdk'
import { DataScraperTOAENTITY } from './domain'
import { buildTOAOrdersEntity, getFormattedDateRange } from './utils'

export async function BootstrapTOA() {
    const mongoService = new MongoService()
    let companies

    try {
        companies = await mongoService.getActiveCompanies()
    } finally {
        await mongoService.close()
    }

    let browser: Browser | null = null

    try {
        browser = await launch(PUPPETEER_CONFIG)

        for (const company of companies) {
            const context = await browser.createBrowserContext()
            const page = await context.newPage()

            try {
                const targetToa = company.scrapingTargets.find(
                    (t) => t.system === ScrapingSystem.TOA
                )

                if (!targetToa) {
                    console.warn(`No se encontró el target TOA para la empresa ${company.code}`)
                    continue
                }

                const loginService = new LoginService(page)
                await loginService.login(targetToa)

                const filter = new FilterSelector(page)
                await filter.selectAllChildrenData()

                const ids: string[] = []
                const scraper = new ProvidersScraper(page)
                await scraper.getProvidersId(ids)

                const orderFetcher = new OrderDataFetcher(page)
                const data: DataScraperTOAENTITY[] = []

                for (let i = 0; i <= ENV.LOOKBACK_DAYS; i++) {
                    const fec = new Date()
                    fec.setDate(fec.getDate() - i)
                    const date = getFormattedDateRange(fec)

                    for (const [j, id] of ids.entries()) {
                        await orderFetcher.getOrderData(targetToa, id, data, date, ids, 0, j)
                    }
                }

                const entities = await buildTOAOrdersEntity(data)
                const orderedEntities = await GroupOrdersByCompany(entities, companies, mongoService)
                await SaveOrders(orderedEntities, mongoService)

                console.log(`✅ Scraping completado para ${company.code}`)
            } catch (err) {
                console.error(`❌ Error scrapeando ${company.code}:`, err)
            } finally {
                if (ENV.NODE_ENV !== 'development') {
                    await context.close()
                }
            }
        }
    } catch (err) {
        console.error('Error al iniciar Puppeteer:', err)
    } finally {
        if (browser && ENV.NODE_ENV !== 'development') {
            await browser.close()
        }
    }
}
