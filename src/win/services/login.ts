import { AxiosInstance } from 'axios'
import { ScrapingCredentialDTO } from 'logiflowerp-sdk';

function b64decode(str: string) {
    return Buffer.from(str, 'base64').toString('utf8')
}

export async function login(client: AxiosInstance, scrapingCredential: ScrapingCredentialDTO) {
    console.log('   [INFO] Iniciando login...')

    const loginPayload = {
        CodiUsua: scrapingCredential.userName,
        Contraseña: scrapingCredential.password,
        CodiSuscrip: 'WIN',
        Navegador: 'Navegador Chrome version:140.0 sobre Windows',
        Query: '',
        AutenDoblePasoCodi: '',
        LoginInterno: 'N'
    };

    console.log('   [INFO] Enviando credenciales al endpoint de login...')
    const loginRes = await client.post(
        `${scrapingCredential.url}/login.aspx/IniciarSesion`,
        loginPayload
    )
    console.log('   [OK  ] Respuesta recibida del login')

    console.log('   [INFO] Decodificando respuesta base64...')
    const decodedD = JSON.parse(b64decode(loginRes.data.d))

    const mensajeDecoded = b64decode(decodedD.mensaje)

    if (decodedD.codigo !== '99') {
        throw new Error(`[ERROR] No se pudo iniciar sesión: ${mensajeDecoded}`)
    }

    console.log('   [INFO] Extrayendo URL de redirección...')
    const m = mensajeDecoded.match(/location\.href\s*=\s*"(.*?)"/)
    if (!m || !m[1]) {
        throw new Error('[ERROR] No se encontró URL en mensaje decodificado')
    }
    const redirectUrl = m[1]
    console.log('   [INFO] redirectUrl:', redirectUrl)

    console.log('   [INFO] Siguiendo redirección a default.aspx...')
    const pageRes = await client.get(redirectUrl)
    console.log(`   [OK  ] GET redirect status: ${pageRes.status}`)
    console.log('   [OK  ] GET redirect finalURL:', pageRes.request?.res?.responseUrl || 'n/a')

    console.log('   [SUCCESS] LOGIN ÉXITOSO')
}
