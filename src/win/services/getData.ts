import fs from 'fs'
import { AxiosInstance } from 'axios';
import { saveColumns } from './saveColumns';
import { ScrapingCredentialDTO } from 'logiflowerp-sdk';
import { b64decode, getFechaVisi, htmlStringToJson } from '../utils';
import { ENV } from '@/config';

export async function getData(
    client: AxiosInstance,
    scrapingCredential: ScrapingCredentialDTO,
) {
    const { Desde, Hasta } = getFechaVisi()

    let todasLasOrdenes = []
    let totalRegistros = 0
    let totalPaginas = 1
    let paginaActual = 1
    let registrosPorPagina = 30
    let headers

    console.log(`   [INFO] Solicitando mis órdenes (${Desde} - ${Hasta})...`)

    while (paginaActual <= totalPaginas) {
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
            pagiActu: paginaActual,
            idPage: 74,
            ubi: '',
            tipoUbi: '',
            IdProyec: '',
            Motivo: '0',
            MotivosReproId: '0'
        }

        await saveColumns(client, scrapingCredential)

        console.log(`   [INFO] → Solicitando página ${paginaActual}...`)

        const grillaRes = await client.post(
            `${scrapingCredential.url}/Paginas/OperadoresBO/misOrdenes.aspx/cargarGrilla`,
            cargarGrillaPayload
        )

        const decodedD = JSON.parse(b64decode(grillaRes.data.d))
        const decodedHtml = b64decode(decodedD.html)

        const { data: registrosPagina, headers: newHeaders } = htmlStringToJson(decodedHtml, headers)
        todasLasOrdenes.push(...registrosPagina)
        if (!headers) headers = newHeaders

        // Solo la primera vez calculamos el total de páginas
        if (paginaActual === 1) {
            totalRegistros = Number(b64decode(decodedD.registros))
            registrosPorPagina = registrosPagina.length
            totalPaginas = Math.ceil(totalRegistros / registrosPorPagina)
            console.log(`   [INFO] Total registros: ${totalRegistros}`)
            console.log(`   [INFO] Total páginas: ${totalPaginas}`)
        }

        console.log(`   [OK  ] Página ${paginaActual}: ${registrosPagina.length} registros`)
        paginaActual++
    }

    await saveColumns(client, scrapingCredential, true)

    if (ENV.NODE_ENV === 'development') {
        fs.writeFileSync('data.json', JSON.stringify(todasLasOrdenes, null, 4), 'utf8')
    }

    console.log(`   [INFO] Se obtuvieron ${todasLasOrdenes.length} registros en total`)

    return todasLasOrdenes
}