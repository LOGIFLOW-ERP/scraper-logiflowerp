import { StateInternalOrderWin, validateCustom, WINOrderENTITY } from 'logiflowerp-sdk'
import { parseDateTime } from './parseDateTime'
import { parseHistorialEstados } from './parseHistorialEstados'
import { parseUbicacion } from './parseUbicacion'
import { parseDatosTecnicos } from './parseDatosTecnicos'
import { parseSuscripcion } from './parseSuscripcion'
import fs from 'fs'
import { CompanyRootFields } from '@/services'
import { ENV } from '@/config'

export async function buildModel(
    data: Record<string, any>[],
    mapaRequestNumber: Set<string>,
    mapaEmployees: Set<string>,
    company: CompanyRootFields
) {
    const _data: Record<string, any>[] = []
    const recursosUnicos = new Set()
    for (const el of data) {
        try {
            if (mapaRequestNumber.has(el['Cod Seguimiento Cliente'])) {
                continue
            }

            el['ID Recurso'] = el['Cuadrilla']

            recursosUnicos.add(el['ID Recurso'])

            if (!mapaEmployees.has(el['ID Recurso'])) {
                continue
            }

            el['Fecha Visita'] = parseDateTime(el['Fecha Visita'], 'Fecha Visita', company)
            el['Inicio de Visita'] = el['Inicio de Visita'] === ''
                ? new Date(0)
                : parseDateTime(el['Inicio de Visita'], 'Inicio de Visita', company)
            el['Fin de Visita'] = el['Fin de Visita'] === ''
                ? new Date(0)
                : parseDateTime(el['Fin de Visita'], 'Fin de Visita', company)
            el['Fecha Estado'] = parseDateTime(el['Fecha Estado'], 'Fecha Estado', company)
            el['Fecha Solicitud'] = parseDateTime(el['Fecha Solicitud'], 'Fecha Solicitud', company)
            parseHistorialEstados(el, company)
            parseUbicacion(el)
            parseDatosTecnicos(el)
            parseSuscripcion(el)
            el._id = crypto.randomUUID()
            el.Fotos = []
            el.Inventory = []
            el.isDeleted = false
            el['Estado Interno'] = StateInternalOrderWin.PENDIENTE
            await validateCustom(structuredClone(el), WINOrderENTITY, Error)
            _data.push(el)
        } catch (error) {
            console.log(el)
            throw error
        }
    }
    console.log(`   [INFO] Se modeló ${_data.length} órdenes`)

    if (ENV.NODE_ENV === 'development') {
        const contenido = Array.from(recursosUnicos).join('\n')
        fs.writeFileSync(`recursos_unicos_${company.code}.txt`, contenido, 'utf-8')
    }

    return _data
}