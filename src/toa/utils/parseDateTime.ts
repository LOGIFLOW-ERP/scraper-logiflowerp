export function parseDateTimeSettlementDate(dateTimeStr: string) {
    // Regex para YYYY-MM-DD HH:mm:ss
    const regexFull = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/
    // Regex para YYYY-MM-DD HH:mm
    const regexShort = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/
    // Regex para YYYY-MM-DD
    const regexDateOnly = /^\d{4}-\d{2}-\d{2}$/

    let isoString

    if (regexFull.test(dateTimeStr)) {
        isoString = dateTimeStr.replace(" ", "T")
    } else if (regexShort.test(dateTimeStr)) {
        isoString = dateTimeStr.replace(" ", "T") + ":00"
    } else if (regexDateOnly.test(dateTimeStr)) {
        isoString = dateTimeStr + "T00:00:00"
    } else {
        throw new Error("formato inválido (regex)")
    }

    const date = new Date(isoString)
    if (isNaN(date.getTime())) {
        throw new Error("formato inválido (Date)")
    }

    return date
}
