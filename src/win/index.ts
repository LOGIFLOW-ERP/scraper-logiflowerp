import axios from 'axios'
import { wrapper } from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'
import { getData, login, SendData } from './services'
import { buildModel } from './utils'
import { MailService, MongoService } from '@/services'
import { ENV } from '@/config'
import { RootCompanyENTITY, ScrapingSystem } from 'logiflowerp-sdk'

const system = ScrapingSystem.WIN

export async function BootstrapWIN() {
    const mongoService = new MongoService()

    let companies
    try {
        companies = await mongoService.getActiveCompanies()
    } finally {
        await mongoService.close()
    }

    const dataCompanies = companies.filter(e => e.scrapingTargets.some(el => el.system === system))
    if (!dataCompanies.length) {
        console.log(`[INFO] No hay empresas con credenciales para sistema ${system}`)
    }
    for (const [i, company] of dataCompanies.entries()) {
        console.log(`[INFO] Scraping ${company.code} (${i + 1} de ${dataCompanies.length})...`)
        try {
            await exec(company)
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

    // //#region WebHook
    // const url = `${ENV.HOST_API}/processes/winorder/update-consumed`
    // const response = await fetch(url, { method: 'POST', headers: { 'Authorization': `Bearer ${ENV.TOKEN}` } })
    // if (!response.ok) {
    //     const errorText = await response.text()
    //     throw new Error(`Error ${response.status}: ${errorText}`)
    // }
    // //#endregion WebHook
}

async function exec(company: Pick<RootCompanyENTITY, "_id" | "scrapingTargets" | "code">) {
    const jar = new CookieJar()
    const client = wrapper(axios.create({ jar, withCredentials: true }))

    const scrapingCredential = company.scrapingTargets.find(e => e.system === system)
    if (!scrapingCredential) {
        throw new Error(`No se pudo obtener scrapingCredential ${system}`)
    }

    const mongoService = new MongoService()

    let requestNumberTTL
    try {
        requestNumberTTL = await mongoService.getWinRequestNumberTTL(company.code)
    } finally {
        await mongoService.close()
    }
    const mapaRequestNumber = new Set(requestNumberTTL.map(e => e.numero_de_peticion))

    let employees
    try {
        employees = await mongoService.getPersonelCompanies([company])
    } finally {
        await mongoService.close()
    }

    const mapaEmployees = new Set(employees.flatMap(e => e.resourceSystem.filter(el => el.system === ScrapingSystem.WIN).map(e => e.resource_id)))

    await login(client, scrapingCredential)
    const data = await getData(client, scrapingCredential)
    const _data = await buildModel(data, mapaRequestNumber, mapaEmployees)
    await new SendData().exec(_data, company.code)
}