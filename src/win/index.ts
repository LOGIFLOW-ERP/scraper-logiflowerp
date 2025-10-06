import axios from 'axios'
import { wrapper } from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'
import { getData, login } from './services'
import { buildModel } from './utils'
import { MailService, MongoService } from '@/services'
import { ENV } from '@/config'
import { ScrapingCredentialDTO, ScrapingSystem } from 'logiflowerp-sdk'

export async function BootstrapWIN() {
    const system = ScrapingSystem.WIN
    try {
        const mongoService = new MongoService()
        const companies = await mongoService.getActiveCompanies()
        const dataCompanies = companies.filter(e => e.scrapingTargets.some(el => el.system === system))
        if (!dataCompanies.length) {
            console.log(`[INFO] No hay empresas con credenciales para sistema ${system}`)
        }
        for (const [i, company] of dataCompanies.entries()) {
            console.log(`[INFO] Scraping ${company.code} (${i + 1} de ${dataCompanies.length})...`)
            try {
                const scrapingCredential = company.scrapingTargets.find(e => e.system === system)
                if (!scrapingCredential) {
                    throw new Error(`No se pudo obtener scrapingCredential ${system}`)
                }
                await exec(scrapingCredential)
                console.log(`[INFO] Scraping completado para ${company.code}...`)
            } catch (error) {
                console.error(error)
                const instance = new MailService()
                console.info('📧 Enviando mail...')
                await instance.send(ENV.DEVS_EMAILS, `Error en scraper ${system} - ${company.code}`, (error as Error).message)
                console.info('📧 Mail enviado.')
            }
        }
        console.log(`[INFO] Scraping completado ✅`)
    } catch (error) {
        console.error(error)
        const instance = new MailService()
        console.info('📧 Enviando mail...')
        await instance.send(ENV.DEVS_EMAILS, `Error en scraper ${system}`, (error as Error).message)
        console.info('📧 Mail enviado.')
    }
}

async function exec(scrapingCredential: ScrapingCredentialDTO) {
    const jar = new CookieJar()
    const client = wrapper(axios.create({ jar, withCredentials: true }))

    await login(client, scrapingCredential)
    const data = await getData(client, scrapingCredential)
    const entities = await buildModel(data)
}