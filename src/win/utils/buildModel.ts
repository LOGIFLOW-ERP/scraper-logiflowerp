import { validateCustom, WINOrderENTITY } from 'logiflowerp-sdk'
import { parseDateTime } from './parseDateTime'
import { parseHistorialEstados } from './parseHistorialEstados'
import { parseUbicacion } from './parseUbicacion'

export async function buildModel(data: Record<string, any>[]) {
    const _data: WINOrderENTITY[] = []
    for (const el of data) {
        try {
            el['Fecha Visita'] = parseDateTime(el['Fecha Visita'], 'Fecha Visita')
            el['Inicio de Visita'] = el['Inicio de Visita'] === ''
                ? new Date(0)
                : parseDateTime(el['Inicio de Visita'], 'Inicio de Visita')
            el['Fin de Visita'] = el['Fin de Visita'] === ''
                ? new Date(0)
                : parseDateTime(el['Fin de Visita'], 'Fin de Visita')
            el['Fecha Estado'] = parseDateTime(el['Fecha Estado'], 'Fecha Estado')
            el['Fecha Solicitud'] = parseDateTime(el['Fecha Solicitud'], 'Fecha Solicitud')
            parseHistorialEstados(el)
            parseUbicacion(el)
            el._id = crypto.randomUUID()
            el.Inventory = []
            _data.push(await validateCustom(el, WINOrderENTITY, Error))
        } catch (error) {
            console.log(el)
            throw error
        }
    }
    console.log(`   [INFO] Se modeló ${_data.length} órdenes`)
    return _data
}