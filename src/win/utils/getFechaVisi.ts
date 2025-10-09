import { ENV } from "@/config"

function formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
}

export function getFechaVisi() {
    const hoy = new Date()
    const Hasta = formatDate(hoy)

    const desdeDate = new Date()
    desdeDate.setDate(hoy.getDate() - ENV.WIN_LOOKBACK_DAYS)
    const Desde = formatDate(desdeDate)

    return { Hasta, Desde }
}
