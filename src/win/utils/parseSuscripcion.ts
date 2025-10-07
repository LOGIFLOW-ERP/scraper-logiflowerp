export function parseSuscripcion(row: Record<string, any>) {
    const obj = Object.fromEntries(
        row['Suscripción'].split('|').map((part: string) => {
            const [key, value] = part.split(':')
            return [key.trim(), value?.trim()]
        })
    )

    obj['Cantidad de Mesh'] = Number(obj['Cantidad de Mesh'])

    row['Suscripción'] = obj
}