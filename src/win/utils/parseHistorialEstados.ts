import { parseDateTime } from "./parseDateTime"

export function parseHistorialEstados(row: Record<string, any>) {
    const texto: string = row['Historial de Estados'] ?? row['Historial de Estados_1']

    // Separar por punto y coma (cada registro)
    const registros = texto.split(';').filter(r => r.trim().length > 0)

    row['Historial de Estados'] = registros.map((reg, i) => {
        const fechaMatch = reg.match(/Fecha:\s(.*?)\sEstado:/)
        const estadoMatch = reg.match(/Estado:\s(.*?)\sUsuario:/)
        const usuarioMatch = reg.match(/Usuario:\s(.*?)\sObservacion:/)
        const observacionMatch = reg.match(/Observacion:\s(.*)$/)

        return {
            Fecha: parseDateTime(fechaMatch ? fechaMatch[1].trim() : '', `Historial de Estados[${i}].Fecha`),
            Estado: estadoMatch ? estadoMatch[1].trim() : null,
            Usuario: usuarioMatch ? usuarioMatch[1].trim() : null,
            Observacion: observacionMatch ? observacionMatch[1].trim() : ''
        }
    })
}
