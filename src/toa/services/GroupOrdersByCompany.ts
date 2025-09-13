import { MongoService } from '@/services'
import { RootCompanyENTITY, TOAOrderENTITY } from 'logiflowerp-sdk'

export async function GroupOrdersByCompany(
    TOAOrders: TOAOrderENTITY[],
    companies: Pick<RootCompanyENTITY, '_id' | 'scrapingTargets' | 'code'>[],
    mongoService: MongoService
) {
    const orderMap = new Map<number, TOAOrderENTITY[]>()
    for (const order of TOAOrders) {
        if (!orderMap.has(order.toa_resource_id)) {
            orderMap.set(order.toa_resource_id, [])
        }
        orderMap.get(order.toa_resource_id)!.push(order)
    }

    const result = new Map<string, TOAOrderENTITY[]>()

    for (const company of companies) {
        let personal

        try {
            personal = await mongoService.getPersonnelCompany(company.code)
        } finally {
            await mongoService.close()
        }

        const toa_resource_ids = new Set(personal.map(e => e.toa_resource_id))

        const companyOrders: TOAOrderENTITY[] = []
        for (const id of toa_resource_ids) {
            const orders = orderMap.get(id)
            if (orders) companyOrders.push(...orders)
        }

        result.set(company.code, companyOrders)
    }

    return result
}