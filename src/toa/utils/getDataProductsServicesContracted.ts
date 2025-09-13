import * as cheerio from 'cheerio'

export function getDataProductsServicesContracted(params: any, inv_aid: number) {

    for (const key in params.delta.Activity) {
        if (key === inv_aid.toString()) {
            const value = params.delta.Activity[key]
            const html = value['163']

            if (html === undefined) {
                return []
            }

            const $ = cheerio.load(html)

            const rows = $('table tr').toArray()
            if (rows.length < 2) return []

            // 🔹 Tomar la segunda fila como cabecera
            const headers = $(rows[1])
                .find('th')
                .toArray()
                .map((th) => $(th).text().trim() || '')

            const data: Record<string, string>[] = []

            // 🔹 Recorrer filas de datos desde la tercera fila
            rows.slice(2).forEach((row) => {
                const cells = $(row).find('td').toArray()
                if (!cells.length) return

                const rowData: Record<string, string> = {}
                headers.forEach((header, i) => {
                    rowData[header] = $(cells[i]).text().trim() || ''
                })
                if (rowData.Código === '') {
                    return
                }
                data.push(rowData)
            })

            return data
        }
    }
    return []
}