import { AxiosInstance } from 'axios';
import { b64decode, getFechaVisi, htmlStringToJson } from '../utils';
import { ScrapingCredentialDTO } from 'logiflowerp-sdk';
import fs from 'fs'

export async function getData(
    client: AxiosInstance,
    scrapingCredential: ScrapingCredentialDTO,
) {
    const { Desde, Hasta } = getFechaVisi()
    const cargarGrillaPayload = {
        tipoOrden: 1,
        tipoTraba: '0',
        estado: '0',
        OrdenId: '',
        NumeDocu: '',
        Nombre: '',
        suscrip: '',
        fechaEstaDesde: '',
        fechaEstaHasta: '',
        fechaVisiDesde: Desde,
        fechaVisiHasta: Hasta,
        fechaSoliDesde: '',
        fechaSoliHasta: '',
        conexion: '0',
        cuadrilla: '0',
        provincia: '0',
        localidad: '0',
        region: '0',
        zona: '0',
        tipoProduc: '0',
        producto: null,
        Empresa: '0',
        Pais: '0',
        pagiActu: 1,
        idPage: 74,
        ubi: '',
        tipoUbi: '',
        IdProyec: '',
        Motivo: '0',
        MotivosReproId: '0'
    }

    console.log(`   [INFO] Solicitando mis órdenes (cargarGrilla Desde: ${Desde} - Hasta: ${Hasta})...`)

    const grillaRes = await client.post(
        `${scrapingCredential.url}/Paginas/OperadoresBO/misOrdenes.aspx/cargarGrilla`,
        cargarGrillaPayload
    )

    console.log('   [OK  ] Respuesta recibida de mis órdenes')

    console.log('   [INFO] Decodificando respuesta base64...')

    const decodedD = JSON.parse(b64decode(grillaRes.data.d))
    const decodedHtml = b64decode(decodedD.html)

    const data = htmlStringToJson(decodedHtml)

    const jsonData = JSON.stringify(data, null, 2)
    fs.writeFileSync('data.json', jsonData, 'utf8')
    console.log(`   [INFO] Se obtuvo ${data.length} órdenes`)
    return data
}