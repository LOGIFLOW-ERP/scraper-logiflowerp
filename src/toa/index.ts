import { Browser, launch } from 'puppeteer-core'
import { MongoService } from '../services'
import { PUPPETEER_CONFIG } from '@/config'
import { LoginService } from './services'
import { ScrapingSystem } from 'logiflowerp-sdk'

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

                console.log(`✅ Scraping completado para ${company.code}`)
            } catch (err) {
                console.error(`❌ Error scrapeando ${company.code}:`, err)
            } finally {
                await context.close()
            }
        }
    } catch (err) {
        console.error('Error al iniciar Puppeteer:', err)
    } finally {
        if (browser) {
            await browser.close()
        }
    }
}
