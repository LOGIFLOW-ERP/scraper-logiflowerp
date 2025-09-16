import { ENV } from '@/config'
import { DataScraperTOAENTITY } from '../domain'

export class SendData {
    private CHUNK_SIZE = 100

    async exec(data: DataScraperTOAENTITY[]) {
        console.info(`Se van a enviar ${data.length} registros en lotes de ${this.CHUNK_SIZE}`)

        const url = `${ENV.HOST_API}/processes/toaorder/save`

        for (let i = 0; i < data.length; i += this.CHUNK_SIZE) {
            const chunk = data.slice(i, i + this.CHUNK_SIZE)
            console.info(`Enviando lote ${i / this.CHUNK_SIZE + 1} (${chunk.length} registros)`)

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${ENV.TOKEN}`,
                    },
                    body: JSON.stringify({ data: chunk }),
                })

                if (!response.ok) {
                    const errorText = await response.text()
                    throw new Error(`Error ${response.status}: ${errorText}`)
                }
            } catch (error) {
                console.error(`Error al enviar lote ${i / this.CHUNK_SIZE + 1}:`, error)
                throw error
            }
        }

        console.info('Todos los lotes fueron enviados correctamente.')
    }
}
