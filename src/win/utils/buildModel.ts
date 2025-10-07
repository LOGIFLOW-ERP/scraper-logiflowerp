import { validateCustom, WINOrderENTITY } from 'logiflowerp-sdk'
import { parseDateTime } from './parseDateTime'
import { parseHistorialEstados } from './parseHistorialEstados'
import { parseUbicacion } from './parseUbicacion'
import { parseDatosTecnicos } from './parseDatosTecnicos'
import { parseSuscripcion } from './parseSuscripcion'


export async function buildModel(
    data: Record<string, any>[],
    mapaRequestNumber: Set<string>,
    mapaEmployees: Set<string>
) {
    const _data: Record<string, any>[] = []
    for (const el of data) {
        try {
            if (mapaRequestNumber.has(el['Cod Seguimiento Cliente'])) {
                continue
            }

            el['ID Recurso'] = el['Cuadrilla'].split('COBRA SGI')[0].replaceAll(' ', '')

            if (!mapaEmployees.has(el['ID Recurso'])) {
                continue
            }

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
            parseDatosTecnicos(el)
            parseSuscripcion(el)
            el._id = crypto.randomUUID()
            el.Inventory = []
            await validateCustom(structuredClone(el), WINOrderENTITY, Error)
            _data.push(el)
        } catch (error) {
            console.log(el)
            throw error
        }
    }
    console.log(`   [INFO] Se modeló ${_data.length} órdenes`)
    return _data
}