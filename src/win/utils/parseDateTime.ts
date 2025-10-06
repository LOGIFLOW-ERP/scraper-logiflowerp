export function parseDateTime(dateTimeStr: string, key: string) {
    try {
        // "dd/mm/yyyy hh:mm"
        const regex = /^\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2}$/
        // "d/m/yyyy hh:mm:ss AM|PM"
        const regex1 = /^\d{1,2}\/\d{1,2}\/\d{4}\s\d{1,2}:\d{2}:\d{2}\s(AM|PM)$/
        // "dd/mm/yyyy hh:mm:ss"
        const regex2 = /^\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2}:\d{2}$/

        let isoString

        if (regex.test(dateTimeStr) || regex2.test(dateTimeStr)) {
            const [fecha, hora] = dateTimeStr.split(' ')
            const [dd, mm, yyyy] = fecha.split('/')
            isoString = `${yyyy}-${mm}-${dd}T${hora}`
        } else if (regex1.test(dateTimeStr)) {
            const [fecha, hora, ampm] = dateTimeStr.split(' ')
            const [d, m, yyyy] = fecha.split('/')
            let [hh, min, sec] = hora.split(':').map(Number)

            if (ampm === 'PM' && hh < 12) hh += 12
            if (ampm === 'AM' && hh === 12) hh = 0

            const ddStr = d.padStart(2, '0')
            const mmStr = m.padStart(2, '0')
            const hhStr = String(hh).padStart(2, '0')
            const minStr = String(min).padStart(2, '0')
            const secStr = String(sec).padStart(2, '0')

            isoString = `${yyyy}-${mmStr}-${ddStr}T${hhStr}:${minStr}:${secStr}`
        } else {
            throw new Error('formato inválido (regex)')
        }

        const date = new Date(isoString)
        if (isNaN(date.getTime())) {
            throw new Error('Formato inválido (Date)')
        }

        return date
    } catch (error) {
        console.log(key)
        throw error
    }
}