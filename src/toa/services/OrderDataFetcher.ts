import { Page } from 'puppeteer-core'
import {
    convertExcelBytesToJson,
    parseSegmentoXml,
} from '../utils'
import { ScrapingCredentialDTO } from 'logiflowerp-sdk'
import { PageFetcherCSV } from './PageFetcherCSV'
import { ENV } from '@/config'

export class OrderDataFetcher {
    private page: Page
    private fetcherCSV: PageFetcherCSV

    constructor(page: Page) {
        this.page = page
        this.fetcherCSV = new PageFetcherCSV(page)
    }

    public async getOrderData(
        targetToa: ScrapingCredentialDTO,
        mapaRequestNumber: Set<string>,
        mapaEmployees: Set<number>,
        providerId: string,
        data: any[],
        date: string,
        _i: number,
        j: number,
        ids: number
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

        // 4. Validar y transformar a entidades
        for (const [i, element] of responseJson.entries()) {
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

                if (!mapaEmployees.has(element['ID Recurso'])) {
                    continue
                }

                element.date = date

                // element.ProductsServicesContracted = []
                // element['Fecha de Cita'] = parseFechaDeCita(element['Fecha de Cita'])
                // element.SettlementDate = new Date(0)
                // element.StartDate = new Date(0)
                // element._id = crypto.randomUUID()
                // element.isDeleted = false
                // element.date = date
                // element['Velocidad Internet Requerimiento'] = typeof element['Velocidad Internet Requerimiento'] === 'number'
                //     ? element['Velocidad Internet Requerimiento'].toString()
                //     : element['Velocidad Internet Requerimiento']
                // element.Amplificador = typeof element.Amplificador === 'number'
                //     ? element.Amplificador.toString()
                //     : element.Amplificador
                // element['Observaciones en Legados'] = typeof element['Observaciones en Legados'] === 'number'
                //     ? element['Observaciones en Legados'].toString()
                //     : element['Observaciones en Legados']
                // element.Inventory = []
                // element['Código Cierre Cancelada'] = element['Código Cierre Cancelada'] ?? ''
                // element['Nombre Cliente'] = element['Nombre Cliente'] ?? ''
                // element['Habilidad del trabajo'] = element['Habilidad del trabajo'] ?? ''
                // element['Tecnología Voz'] = element['Tecnología Voz'] ?? ''
                // element['Tipo de Tecnología Legados'] = element['Tipo de Tecnología Legados'] ?? ''
                // element['Velocidad Internet Requerimiento'] = element['Velocidad Internet Requerimiento'] ?? ''
                // element['Orden Pangea'] = element['Orden Pangea'] ?? ''
                // element['Tecnología TV'] = element['Tecnología TV'] ?? ''
                // element['Número Teléfono'] = element['Número Teléfono'] ?? 0
                // element['AccessID'] = element['AccessID'] ?? 0
                // element['Fecha de Registro Legados'] = parseCustomDate(element['Fecha de Registro Legados'])
                // element['last_update_date'] = new Date(0)

                // groupPlantaUbicacion(element)

                data.push(element)
                console.log(`Procesando ${_i}/${ENV.LOOKBACK_DAYS} dias (${element.date}), procesando ${j + 1}/${ids} buckets, procesando ${i + 1} de ${responseJson.length} ordenes`)
            } catch (error) {
                console.log(element)
                throw error
            }
        }

        console.log(`✅ Se descargaron ${data.length} ordenes.`)
        await this.wait(500)
    }

    private async wait(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }
}
