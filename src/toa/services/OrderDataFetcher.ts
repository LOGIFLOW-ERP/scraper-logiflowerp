import { Page } from 'puppeteer-core'
import {
    convertExcelBytesToJson,
    formatErrors,
    getDataInventory,
    getDataProductsServicesContracted,
    getSettlementDate,
    parseSegmentoXml,
    parseTrazabilidadDelPluginXml,
} from '../utils'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { DataScraperTOAENTITY } from '../domain'
import { ScrapingCredentialDTO } from 'logiflowerp-sdk'
import { PageFetcherCSV } from './PageFetcherCSV'
import { PageFetcherDetail } from './PageFetcherDetail'
import { SearchPageHandler } from './SearchPageHandler'
import { ENV } from '@/config'

export class OrderDataFetcher {
    private page: Page
    private fetcherCSV: PageFetcherCSV
    private fetcherDetail: PageFetcherDetail

    constructor(page: Page) {
        this.page = page
        this.fetcherCSV = new PageFetcherCSV(page)
        this.fetcherDetail = new PageFetcherDetail(page)
    }

    public async getOrderData(
        targetToa: ScrapingCredentialDTO,
        providerId: string,
        data: DataScraperTOAENTITY[],
        date: string,
        ids: string[],
        _i: number,
        j: number,
    ) {
        console.log(`⌛ Obteniendo ordenes (providerId: ${providerId})...`)

        // 1. Preparar query
        const downloadId = Date.now().toString(36) + Math.random().toString(36).substr(2)
        const query = `?m=gridexport&a=download&itype=manage&providerId=${providerId}&date=${date}&panel=top&view=time&downloadId=${downloadId}&dates=${date}&recursively=1&&${new Date().getTime()}`
        const fetchUrl = `${targetToa.url}/${query}`

        // 2. Descargar archivo desde el navegador
        const responseBytes = await this.fetcherCSV.fetchData(fetchUrl)

        // 3. Convertir y parsear datos
        const responseJson = convertExcelBytesToJson(responseBytes)
        parseSegmentoXml(responseJson)
        parseTrazabilidadDelPluginXml(responseJson)

        const handler = new SearchPageHandler(this.page, targetToa)
        const _response = await handler.searchAndSelectItem()

        // 4. Validar y transformar a entidades
        for (const [i, element] of responseJson.entries()) {
            try {
                const detail = await this.fetcherDetail.fetchData(_response, {
                    pid: element['ID Recurso'],
                    u: targetToa.userName,
                    requestedAid: element['Número OT'],
                    date
                })

                element.ProductsServicesContracted = getDataProductsServicesContracted(detail, element['Número OT'])
                element.SettlementDate = new Date(0)

                if (element['Estado actividad'] === 'Completado') {
                    element.SettlementDate = getSettlementDate(detail, element['Número OT'])
                    element.Inventory = getDataInventory(detail, element['Número OT'])
                }

                const instance = plainToInstance(
                    DataScraperTOAENTITY,
                    element,
                    { excludeExtraneousValues: true }
                )
                const errors = await validate(instance, {
                    forbidNonWhitelisted: true,
                    whitelist: true
                })

                if (errors.length > 0) {
                    const message = formatErrors(errors)
                    console.log(element)
                    throw new Error(`❌ Validación fallida: ${message}`)
                }

                data.push(instance)
                console.log(`Procesando ${_i}/${ENV.LOOKBACK_DAYS} dias (${date}), procesando ${j}/${ids.length} buckets, procesando ${i + 1} de ${responseJson.length} ordenes`)
            } catch (error) {
                console.log(element)
                throw error
            }
        }

        console.log(`✅ Se descargaron ${data.length} ordenes (providerId: ${providerId}).`)
    }
}
