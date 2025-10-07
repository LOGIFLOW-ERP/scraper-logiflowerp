export function parseDatosTecnicos(row: Record<string, any>) {
    const obj: Record<string, any> = {}

    row['Datos Técnicos'].split(';').filter(Boolean).forEach((part: string) => {
        const parts = part.split('/')
        const key = parts[0]?.trim()
        const value = parts[2]?.trim() || ''
        obj[key] = value
    })

    row['Datos Técnicos'] = obj
}