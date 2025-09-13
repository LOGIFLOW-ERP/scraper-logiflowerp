import { TOAOrderENTITY, validateCustom } from 'logiflowerp-sdk'
import { DataScraperTOAENTITY } from '../domain'

export async function buildTOAOrdersEntity(data: DataScraperTOAENTITY[]) {
    const entities: TOAOrderENTITY[] = []

    for (const element of data) {
        const _entity = new TOAOrderENTITY()
        _entity.toa_resource_id = element['ID Recurso']
        // llenar entidad
        const entity = await validateCustom(_entity, TOAOrderENTITY, Error)
        entities.push(entity)
    }

    return entities
}