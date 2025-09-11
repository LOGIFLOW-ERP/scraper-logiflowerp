import { XMLParser } from 'fast-xml-parser'

export const parseSegmentoXml = (responseJson: any[]) => {
    const parser = new XMLParser({
        ignoreAttributes: false,
        trimValues: true,
        isArray: (tagName) => tagName === 'SegmentoCliente'
    })

    for (const element of responseJson) {
        const rawSegmento = element['Segmento']

        if (!rawSegmento || typeof rawSegmento !== 'string') {
            element['Segmento'] = []
            continue
        }

        const parsed = parser.parse(rawSegmento)
        element['Segmento'] = parsed?.XA_CUSTOMER_SEGMENT?.SegmentoCliente ?? []
    }
}
