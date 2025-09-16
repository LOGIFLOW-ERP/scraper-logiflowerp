import { TOAOrderENTITY, validateCustom } from 'logiflowerp-sdk'
import { DataScraperTOAENTITY } from '../domain'

export async function buildTOAOrdersEntity(data: DataScraperTOAENTITY[]) {
    const entities: TOAOrderENTITY[] = []

    for (const element of data) {
        const _id = crypto.randomUUID()
        const entity = await validateCustom({ ...element, _id, isDeleted: false }, TOAOrderENTITY, Error)
        entities.push(entity)
    }

    return entities
}