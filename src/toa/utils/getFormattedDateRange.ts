export const getFormattedDateRange = (diasAtras: number): { formatDesde: string; formatHasta: string } => {
    const fechaHasta = new Date()

    const fechaDesde = new Date()
    fechaDesde.setDate(fechaDesde.getDate() - diasAtras)

    const formatDesde = `${fechaDesde.getFullYear()}-${(fechaDesde.getMonth() + 1).toString().padStart(2, '0')}-${(fechaDesde.getDate()).toString().padStart(2, '0')}`
    const formatHasta = `${fechaHasta.getFullYear()}-${(fechaHasta.getMonth() + 1).toString().padStart(2, '0')}-${(fechaHasta.getDate()).toString().padStart(2, '0')}`

    return { formatDesde, formatHasta }
}
