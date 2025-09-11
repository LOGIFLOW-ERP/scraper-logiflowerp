import { XMLParser } from 'fast-xml-parser'

export const parseTrazabilidadDelPluginXml = (responseJson: any[]) => {
    const parser = new XMLParser({
        ignoreAttributes: false,
        trimValues: true,
        isArray: (tagName) => tagName === 'HISTORICAL'
    })

    for (const element of responseJson) {
        const rawSegmento = element['Trazabilidad del Plugin']

        if (!rawSegmento || typeof rawSegmento !== 'string') {
            element['Trazabilidad del Plugin'] = []
            continue
        }

        const parsed = parser.parse(rawSegmento)
        element['Trazabilidad del Plugin'] = parsed?.A_PLUGIN_TRACEABILITY?.HISTORICAL ?? []
    }
}
