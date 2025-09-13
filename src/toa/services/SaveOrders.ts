import { MongoService } from '@/services'
import { TOAOrderENTITY } from 'logiflowerp-sdk'

export async function SaveOrders(
    orderedEntities: Map<string, TOAOrderENTITY[]>,
    mongoService: MongoService
) {
    for (const [companyCode, orders] of orderedEntities) {
        try {
            await mongoService.saveTOAOrders(companyCode, orders)
        } finally {
            await mongoService.close()
        }
    }
}