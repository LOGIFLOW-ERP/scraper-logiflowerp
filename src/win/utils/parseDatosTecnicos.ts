export function parseDatosTecnicos(row: Record<string, any>) {
    const raw = row['Datos Técnicos']?.trim()

    const keys = [
        'CTO1', 'CTO2', 'CTO3',
        'COORDENADA CTO1', 'COORDENADA CTO2', 'COORDENADA CTO3',
        'DNI', 'RRINST', 'CCI', 'RREF'
    ]

    const obj: Record<string, any> = {}

    if (!raw) {
        keys.forEach(k => obj[k] = '');
        row['Datos Técnicos'] = obj;
        return
    }

    raw.split(';')
        .filter(Boolean)
        .forEach((part: string) => {
            const parts = part.split('/')
            const key = parts[0]?.trim()
            const value = parts[2]?.trim() || ''
            obj[key] = value
        })

    // Asegurar claves faltantes
    keys.forEach(k => {
        if (obj[k] === undefined) obj[k] = ''
    })

    row['Datos Técnicos'] = obj
}