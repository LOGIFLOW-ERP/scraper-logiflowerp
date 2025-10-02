import { HTTPResponse, Page } from 'puppeteer-core'
import {
    getDataInventory,
    getDataProductsServicesContracted,
    getSettlementDate,
} from '../utils'
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
        data: any[],
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

    private async helper(_response: HTTPResponse, order: any, targetToa: ScrapingCredentialDTO) {
        await this.wait(50)

        const detail = await this.fetcherDetail.fetchData(_response, {
            pid: order['ID Recurso'],
            u: targetToa.userName,
            requestedAid: order['Número OT'],
            date: order.date
        })

        order.ProductsServicesContracted = getDataProductsServicesContracted(detail, order['Número OT'])
        order.last_update_date = getSettlementDate(detail, order['Número OT'], 'last_update_date')

        if (order['Estado actividad'] === 'Completado') {
            order.SettlementDate = getSettlementDate(detail, order['Número OT'], 'activity_end_time')
            order.StartDate = getSettlementDate(detail, order['Número OT'], 'activity_start_time')
            order.Inventory = getDataInventory(detail, order['Número OT'])
        }
        order._id = crypto.randomUUID()
        order.isDeleted = false

        await validateCustom(order, TOAOrderENTITY, Error)
    }

    private async wait(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }
}
