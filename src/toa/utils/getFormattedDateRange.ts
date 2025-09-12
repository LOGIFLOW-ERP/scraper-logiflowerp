export const getFormattedDateRange = (fecha: Date = new Date()) => {
    const formatDesde = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}-${(fecha.getDate()).toString().padStart(2, '0')}`
    return formatDesde
}
