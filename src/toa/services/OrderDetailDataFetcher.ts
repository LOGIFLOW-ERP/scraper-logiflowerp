import { HTTPResponse, Page } from 'puppeteer-core'
import {
    getDataInventory,
    getDataProductsServicesContracted,
    getSettlementDate,
} from '../utils'
import { DataScraperTOAENTITY } from '../domain'
import { ScrapingCredentialDTO, TOAOrderENTITY, validateCustom } from 'logiflowerp-sdk'
import { PageFetcherDetail } from './PageFetcherDetail'
import { SearchPageHandler } from './SearchPageHandler'

export class OrderDetailDataFetcher {
    private page: Page
    private fetcherDetail: PageFetcherDetail

    constructor(page: Page) {
        this.page = page
        this.fetcherDetail = new PageFetcherDetail(page)
    }

    public async getOrderData(
        targetToa: ScrapingCredentialDTO,
        data: DataScraperTOAENTITY[],
    ) {
        const handler = new SearchPageHandler(this.page, targetToa)
        const _response = await handler.searchAndSelectItem()

        for (const [i, element] of data.entries()) {
            try {
                await this.helper(_response, element, targetToa)
                console.log(`Procesando detalle ${i + 1} de ${data.length} ordenes`)
            } catch (error) {
                console.log(element)
                throw error
            }
        }
    }

    private async helper(_response: HTTPResponse, element: DataScraperTOAENTITY, targetToa: ScrapingCredentialDTO) {
        await this.wait(50)

        const detail = await this.fetcherDetail.fetchData(_response, {
            pid: element['ID Recurso'],
            u: targetToa.userName,
            requestedAid: element['Número OT'],
            date: element.date
        })

        element.ProductsServicesContracted = getDataProductsServicesContracted(detail, element['Número OT'])
        element.last_update_date = getSettlementDate(detail, element['Número OT'], 'last_update_date')

        if (element['Estado actividad'] === 'Completado') {
            element.SettlementDate = getSettlementDate(detail, element['Número OT'], 'activity_end_time')
            element.StartDate = getSettlementDate(detail, element['Número OT'], 'activity_start_time')
            element.Inventory = getDataInventory(detail, element['Número OT'])
        }

        await validateCustom({ ...element, _id: crypto.randomUUID(), isDeleted: false }, TOAOrderENTITY, Error)
    }

    private async wait(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }
}
