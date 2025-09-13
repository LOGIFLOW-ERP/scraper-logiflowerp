export function parseDateTimeSettlementDate(dateTimeStr: string) {
    // Espera formato "YYYY-MM-DD HH:mm:ss"
    if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateTimeStr)) {
        throw new Error('formato inválido')
    }

    // Reemplaza el espacio por T para cumplir ISO 8601
    const isoString = dateTimeStr.replace(" ", "T")

    const date = new Date(isoString)

    if (isNaN(date.getTime())) {
        throw new Error('formato inválido (1)')
    }

    return date
}
