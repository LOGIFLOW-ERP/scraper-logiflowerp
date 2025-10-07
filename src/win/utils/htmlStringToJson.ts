import * as cheerio from 'cheerio'

export function htmlStringToJson(htmlString: string, headersFromFirstPage?: string[]) {
    if (headersFromFirstPage) {
        htmlString = `<table><tbody>${htmlString}</tbody></table>`
    }

    const $ = cheerio.load(htmlString)

    // Extraemos headers
    let headers: string[] = []

    if (headersFromFirstPage) {
        headers = headersFromFirstPage
    } else {
        $('table thead th').each((i, th) => {
            headers.push($(th).text().trim())
        })
    }

    const data: Record<string, string>[] = []

    $('table tbody tr').each((i, tr) => {
        const obj: Record<string, string> = {};

        $(tr).find('td').each((j, td) => {
            const header = headers[j] || `col_${j}`;
            const text = $(td).text().trim();

            // Detectamos salto de línea y separamos en dos propiedades
            if (text.includes('\n')) {
                const parts = text.split('\n').map(p => p.trim());
                // Nombres personalizados según columna
                if (header === 'País / Empresa') {
                    obj['Pais'] = parts[0] || '';
                    obj['Empresa'] = parts[1] || '';
                } else if (header === 'Región / Zona') {
                    obj['Region'] = parts[0] || '';
                    obj['Zona'] = parts[1] || '';
                } else {
                    // Si no tenemos nombre específico, usamos sufijos genéricos
                    obj[`${header}_1`] = parts[0] || '';
                    obj[`${header}_2`] = parts[1] || '';
                }
            } else {
                obj[header] = text;
            }
        });

        data.push(obj);
    });

    return { data, headers };
}
