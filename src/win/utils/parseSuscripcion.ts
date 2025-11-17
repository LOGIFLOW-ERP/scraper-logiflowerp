export function parseSuscripcion(row: Record<string, any>) {
    const raw = row['Suscripción']?.trim() || '';

    const keys = [
        'Campaña',
        'Paquete',
        "SVA's",
        'Cantidad de Mesh',
        'Instalacion de mesh'
    ];

    const obj: Record<string, any> = {};

    // 1. Parsear lo que venga en el string
    if (raw) {
        raw.split('|')
            .filter(Boolean)
            .forEach((part: string) => {
                const [key, value] = part.split(':');
                obj[key.trim()] = value?.trim();
            });
    }

    // 2. Completar faltantes con valores por defecto
    keys.forEach(k => {
        if (obj[k] === undefined || obj[k] === null) {
            if (k === 'Cantidad de Mesh') {
                obj[k] = 0;
            } else {
                obj[k] = '';
            }
        }
    });

    // 3. Forzar número en Cantidad de Mesh
    obj['Cantidad de Mesh'] = Number(obj['Cantidad de Mesh']) || 0;

    row['Suscripción'] = obj;
}
