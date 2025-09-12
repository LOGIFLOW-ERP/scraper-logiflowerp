import { Page } from "puppeteer-core"
import {
    convertExcelBytesToJson,
    formatErrors,
    getFormattedDateRange,
    parseSegmentoXml,
    parseTrazabilidadDelPluginXml,
} from "../utils"
import { plainToInstance } from "class-transformer"
import { validate } from "class-validator"
import { DataScraperTOAENTITY } from "../domain"
import { ENV } from "@/config"
import { ScrapingCredentialDTO } from "logiflowerp-sdk"
import { PageFetcherCSV } from "./PageFetcherCSV"
import { PageFetcherDetail } from "./PageFetcherDetail"
import { SearchPageHandler } from "./SearchPageHandler"

export class OrderDataFetcher {
    private page: Page
    private fetcherCSV: PageFetcherCSV
    private fetcherDetail: PageFetcherDetail

    constructor(page: Page) {
        this.page = page
        this.fetcherCSV = new PageFetcherCSV(page)
        this.fetcherDetail = new PageFetcherDetail(page)
    }

    public async getOrderData(targetToa: ScrapingCredentialDTO, providerId: string, data: DataScraperTOAENTITY[]) {
        console.log(`⌛ Obteniendo ordenes (providerId: ${providerId})...`)

        // 1. Preparar query
        const downloadId = Date.now().toString(36) + Math.random().toString(36).substr(2)
        const fec = new Date()
        fec.setDate(fec.getDate() - 2)
        const date = getFormattedDateRange(fec);
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
        for (const element of responseJson) {
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

            if (instance["Número de Petición"] === 'FE-1100340629') {
                await this.fetcherDetail.fetchData(_response, {
                    pid: instance['ID Recurso'],
                    u: targetToa.userName,
                    requestedAid: instance['Número OT'],
                })
            }

            data.push(instance)
        }

        console.log(`✅ Se descargaron ${data.length} ordenes (providerId: ${providerId}).`)
    }
}
