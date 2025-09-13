import { Browser, launch } from 'puppeteer-core'
import { MongoService } from '../services'
import { ENV, PUPPETEER_CONFIG } from '@/config'
import {
    FilterSelector,
    LoginService,
    OrderDataFetcher,
    ProvidersScraper,
} from './services'
import { DataScraperTOAENTITY } from './domain'
import { buildTOAOrdersEntity, getFormattedDateRange } from './utils'

export async function BootstrapTOA() {
    const mongoService = new MongoService()
    let targetToa

    try {
        targetToa = await mongoService.getScrapingCredentialTOA()
    } finally {
        await mongoService.close()
    }

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
            const data: DataScraperTOAENTITY[] = []

            for (let i = 0; i <= ENV.LOOKBACK_DAYS; i++) {
                const fec = new Date()
                fec.setDate(fec.getDate() - i)
                const date = getFormattedDateRange(fec)

                for (const [j, id] of ids.entries()) {
                    await orderFetcher.getOrderData(targetToa, id, data, date, ids, 0, j)
                }
            }

            await buildTOAOrdersEntity(data)

            const url = 'http://localhost:3003/api/root/processes/toaorder/save'
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjIxMjEwOGU4LThmMTItNDZjZS05MmRhLTA0MjVlMDU0ODMxZSIsImlkZW50aXR5IjoiNzA0NjA0ODUiLCJkb2N1bWVudFR5cGUiOiJETkkiLCJuYW1lcyI6IkFudG9uaW8gQW1hZG8iLCJzdXJuYW1lcyI6Ik1lamlhIENhcnJpbGxvIiwiY291bnRyeSI6IlBFUiIsImVtYWlsIjoiYW50b25pby5tZWppYUBsb2dpZmxvd2VycC5jb20iLCJyb290IjpmYWxzZX0sInByb2ZpbGUiOnsiX2lkIjoiIiwibmFtZSI6IiIsInN5c3RlbU9wdGlvbnMiOltdfSwicGVyc29ubmVsIjp7Il9pZHByb2ZpbGUiOiIiLCJlbWFpbCI6IiJ9LCJyb290Q29tcGFueSI6eyJjb2RlIjoiTE9HSUZMT1ciLCJydWMiOiIiLCJjb21wYW55bmFtZSI6IiIsImNvdW50cnkiOiIifSwiaWF0IjoxNzU3NzgxNzA2LCJleHAiOjE3NTc4MjQ5MDZ9.gZVWgw8U5gLfv8kRdnIeUCTuJF79yVoILejySRJIwxI'
            await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",      // Indicamos que es JSON
                    "Authorization": `Bearer ${token}`       // Bearer token
                },
                body: JSON.stringify({ data })
            })

            console.log(`✅ Scraping TOA completado`)
        } catch (err) {
            console.error(`❌ Error scrapeando TOA:`, err)
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
}
