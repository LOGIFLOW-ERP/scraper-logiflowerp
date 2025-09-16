import { Page } from 'puppeteer-core'
import {
    convertExcelBytesToJson,
    formatErrors,
    getDataInventory,
    getDataProductsServicesContracted,
    getSettlementDate,
    groupPlantaUbicacion,
    parseCustomDate,
    parseFechaDeCita,
    parseSegmentoXml,
    parseTrazabilidadDelPluginXml,
} from '../utils'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { DataScraperTOAENTITY } from '../domain'
import { RequestNumberTTLENTITY, ScrapingCredentialDTO } from 'logiflowerp-sdk'
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
        mapaRequestNumber: Set<string>,
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

        // console.log(responseJson.filter(e => e['Número de Petición'] === 'FE-1100664165'))

        // 4. Validar y transformar a entidades
        for (const [i, element] of responseJson.slice(0, 200).entries()) {
            try {
                if (element['Número de Petición'] === undefined) {
                    continue
                }

                element['Número de Petición'] = typeof element['Número de Petición'] === 'number'
                    ? element['Número de Petición'].toString()
                    : element['Número de Petición']

                if (mapaRequestNumber.has(element['Número de Petición'])) {
                    continue
                }

                const detail = await this.fetcherDetail.fetchData(_response, {
                    pid: element['ID Recurso'],
                    u: targetToa.userName,
                    requestedAid: element['Número OT'],
                    date
                })

                element.ProductsServicesContracted = getDataProductsServicesContracted(detail, element['Número OT'])
                element['Fecha de Cita'] = parseFechaDeCita(element['Fecha de Cita'])
                element.SettlementDate = new Date(0)
                element._id = crypto.randomUUID()
                element.isDeleted = false
                element['Velocidad Internet Requerimiento'] = typeof element['Velocidad Internet Requerimiento'] === 'number'
                    ? element['Velocidad Internet Requerimiento'].toString()
                    : element['Velocidad Internet Requerimiento']
                element.Amplificador = typeof element.Amplificador === 'number'
                    ? element.Amplificador.toString()
                    : element.Amplificador
                element.Inventory = []
                element['Código Cierre Cancelada'] = element['Código Cierre Cancelada'] ?? ''
                element['Nombre Cliente'] = element['Nombre Cliente'] ?? ''
                element['Habilidad del trabajo'] = element['Habilidad del trabajo'] ?? ''
                element['Tecnología Voz'] = element['Tecnología Voz'] ?? ''
                element['Tipo de Tecnología Legados'] = element['Tipo de Tecnología Legados'] ?? ''
                element['Velocidad Internet Requerimiento'] = element['Velocidad Internet Requerimiento'] ?? ''
                element['Orden Pangea'] = element['Orden Pangea'] ?? ''
                element['Tecnología TV'] = element['Tecnología TV'] ?? ''
                element['Número Teléfono'] = element['Número Teléfono'] ?? 0
                element['AccessID'] = element['AccessID'] ?? 0
                element['Fecha de Registro Legados'] = parseCustomDate(element['Fecha de Registro Legados'])

                groupPlantaUbicacion(element)

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
                    throw new Error(`❌ Validación fallida: ${message}`)
                }

                data.push(element)
                console.log(`Procesando ${_i}/${ENV.LOOKBACK_DAYS} dias (${date}), procesando ${j}/${ids.length} buckets, procesando ${i + 1} de ${responseJson.length} ordenes`)
            } catch (error) {
                console.log(element)
                throw error
            }
        }

        console.log(`✅ Se descargaron ${data.length} ordenes (providerId: ${providerId}).`)
    }
}
