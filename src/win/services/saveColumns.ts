import { AxiosInstance } from 'axios'
import { ScrapingCredentialDTO } from 'logiflowerp-sdk'
import { b64decode } from '../utils'

export async function saveColumns(
    client: AxiosInstance,
    scrapingCredential: ScrapingCredentialDTO,
) {
    const payload = {
        PantallaId: 74,
        Columnas: "{\"Campo\":\"Cliente\",\"CampoBase\":\"Cliente,TipoClienId,Tipo\",\"Estado\":true,\"Orden\":1},{\"Campo\":\"Fecha Visita\",\"CampoBase\":\"F.Visita\",\"Estado\":true,\"Orden\":2},{\"Campo\":\"Estado\",\"CampoBase\":\"Estado\",\"Estado\":true,\"Orden\":3},{\"Campo\":\"Región / Zona\",\"CampoBase\":\"Region,Zona\",\"Estado\":true,\"Orden\":4},{\"Campo\":\"Cuadrilla\",\"CampoBase\":\"Cuadrilla\",\"Estado\":true,\"Orden\":5},{\"Campo\":\"Cod Seguimiento Cliente\",\"CampoBase\":\"CodiSeguiClien\",\"Estado\":true,\"Orden\":6},{\"Campo\":\"Móvil\",\"CampoBase\":\"TeleMovilNume\",\"Estado\":true,\"Orden\":7},{\"Campo\":\"Número Documento\",\"CampoBase\":\"Número Documento\",\"Estado\":true,\"Orden\":8},{\"Campo\":\"Suscripción\",\"CampoBase\":\"IdenServi\",\"Estado\":true,\"Orden\":9},{\"Campo\":\"Dirección\",\"CampoBase\":\"Direccion\",\"Estado\":true,\"Orden\":10},{\"Campo\":\"Motivo Regestión\",\"CampoBase\":\"Motivo Regestión\",\"Estado\":true,\"Orden\":11},{\"Campo\":\"Motivo de Cancelación\",\"CampoBase\":\"Motivo Cancelación\",\"Estado\":true,\"Orden\":12},{\"Campo\":\"Inicio de Visita\",\"CampoBase\":\"FechaIniVisi\",\"Estado\":true,\"Orden\":13},{\"Campo\":\"Fin de Visita\",\"CampoBase\":\"FechaFinVisi\",\"Estado\":true,\"Orden\":14},{\"Campo\":\"Motivo de Suspensión\",\"CampoBase\":\"Motivo Suspensión\",\"Estado\":true,\"Orden\":15},{\"Campo\":\"Fijo\",\"CampoBase\":\"TeleFijoNume\",\"Estado\":true,\"Orden\":16},{\"Campo\":\"Prioridad\",\"CampoBase\":\"Prioridad\",\"Estado\":true,\"Orden\":17},{\"Campo\":\"Tipo Trabajo\",\"CampoBase\":\"TipoTraba\",\"Estado\":true,\"Orden\":18},{\"Campo\":\"Tipo Orden\",\"CampoBase\":\"TipoOrden\",\"Estado\":true,\"Orden\":19},{\"Campo\":\"Código De Seguimiento\",\"CampoBase\":\"CodiSegui\",\"Estado\":true,\"Orden\":20},{\"Campo\":\"Producto\",\"CampoBase\":\"Producto\",\"Estado\":true,\"Orden\":21},{\"Campo\":\"Nº\",\"CampoBase\":\"OrdenId\",\"Estado\":true,\"Orden\":22},{\"Campo\":\"Motivo de Finalización\",\"CampoBase\":\"Motivo Finalización\",\"Estado\":true,\"Orden\":23},{\"Campo\":\"Motivo de Anulación\",\"CampoBase\":\"Motivo Anulación\",\"Estado\":true,\"Orden\":24},{\"Campo\":\"Código Postal\",\"CampoBase\":\"Código Postal\",\"Estado\":true,\"Orden\":25},{\"Campo\":\"Id de Proyecto\",\"CampoBase\":\"Id de Proyecto\",\"Estado\":true,\"Orden\":26},{\"Campo\":\"Proveedeor\",\"CampoBase\":\"Proveedeor\",\"Estado\":true,\"Orden\":27},{\"Campo\":\"Georeferencia\",\"CampoBase\":\"Georeferencia\",\"Estado\":true,\"Orden\":28},{\"Campo\":\"Email\",\"CampoBase\":\"Email\",\"Estado\":true,\"Orden\":29},{\"Campo\":\"Tipo Documento\",\"CampoBase\":\"Tipo Documento\",\"Estado\":true,\"Orden\":30},{\"Campo\":\"Fecha Solicitud\",\"CampoBase\":\"F.Soli\",\"Estado\":true,\"Orden\":31},{\"Campo\":\"Localidad\",\"CampoBase\":\"Localidad,provincia\",\"Estado\":true,\"Orden\":32},{\"Campo\":\"Motivo Trabajo\",\"CampoBase\":\"Motivo Trabajo\",\"Estado\":true,\"Orden\":33},{\"Campo\":\"País / Empresa\",\"CampoBase\":\"Pais,Empresa\",\"Estado\":true,\"Orden\":34},{\"Campo\":\"Tipo Ubicación\",\"CampoBase\":\"Tipo Ubicación\",\"Estado\":true,\"Orden\":35},{\"Campo\":\"Sector Operativo\",\"CampoBase\":\"Sector Operativo\",\"Estado\":true,\"Orden\":36},{\"Campo\":\"Ubicación\",\"CampoBase\":\"Ubicación\",\"Estado\":true,\"Orden\":37},{\"Campo\":\"Datos Técnicos\",\"CampoBase\":\"Datos Técnicos\",\"Estado\":true,\"Orden\":38},{\"Campo\":\"Fecha Estado\",\"CampoBase\":\"FechaUltiEsta\",\"Estado\":true,\"Orden\":39},{\"Campo\":\"Motivo\",\"CampoBase\":\"Motivo\",\"Estado\":true,\"Orden\":40},{\"Campo\":\"Historial de Estados\",\"CampoBase\":\"Historial Estados\",\"Estado\":true,\"Orden\":41}",
        IdPage: "74"
    }
    console.log('   [INFO] Guardando columnas...')

    const { data } = await client.post(
        `${scrapingCredential.url}/Paginas/OperadoresBO/misOrdenes.aspx/GuardarColumnas`,
        payload
    )

    if (data.d === undefined) {
        throw new Error(`¡No se pudo guardar columnas!`)
    }

    if (b64decode(data.d) === 'N') {
        console.log('   [INFO] Columnas guardadas.')
        return
    }

    throw new Error(`¡Ocurrió un error al guardar columnas!`)
}