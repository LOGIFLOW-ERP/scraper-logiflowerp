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
import { PageFetcher } from "./PageFetcher"
import { DataScraperTOAENTITY } from "../domain"
import { ENV } from "@/config"
import { ScrapingCredentialDTO } from "logiflowerp-sdk"

export class OrderDataFetcher {
    private page: Page
    private fetcher: PageFetcher

    constructor(page: Page) {
        this.page = page
        this.fetcher = new PageFetcher(page)
    }

    public async getOrderData(targetToa: ScrapingCredentialDTO, providerId: string, data: DataScraperTOAENTITY[]) {
        console.log(`⌛ Obteniendo ordenes (providerId: ${providerId})...`)

        // 1. Preparar query
        const downloadId = Date.now().toString(36) + Math.random().toString(36).substr(2)
        const { formatDesde, formatHasta } = getFormattedDateRange(ENV.LOOKBACK_DAYS);
        const query = `?m=gridexport&a=download&itype=manage&providerId=${providerId}&date=${formatDesde}&panel=top&view=time&downloadId=${downloadId}&dates=${formatHasta}&recursively=1&&${new Date().getTime()}`
        const fetchUrl = `${targetToa.url}/${query}`

        // 2. Descargar archivo desde el navegador
        const responseBytes = await this.fetcher.fetchData(fetchUrl)

        // 3. Convertir y parsear datos
        const responseJson = convertExcelBytesToJson(responseBytes)
        parseSegmentoXml(responseJson)
        parseTrazabilidadDelPluginXml(responseJson)
        // console.log(responseJson[0])
        // console.log(responseJson[2])
        // console.log(responseJson[5])

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

            data.push(instance)
        }

        console.log(`✅ Se descargaron ${data.length} ordenes (providerId: ${providerId}).`)
    }
}
