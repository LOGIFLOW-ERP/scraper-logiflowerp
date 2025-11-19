import 'reflect-metadata/lite'
import { BootstrapTOA } from './toa'
import { BootstrapWIN } from './win'
import { ENV } from './config'
import { schedule } from 'node-cron'
import { MailService } from './services'

class Job {
    private scraping_data_win: boolean
    private readonly jobNameWin = 'JobScrapingDataWin'

    constructor(
    ) {
        console.log(`[${this.jobNameWin}] 🟢 Programado correctamente`)
        this.scraping_data_win = false
        schedule(
            // `*/30 * ${ENV.WIN_EXECUTION_START_HOUR}-${ENV.WIN_EXECUTION_END_HOUR} * * *`,
            '0 7,16,19 * * *',
            this._execWin.bind(this),
            { timezone: 'America/Lima' }
        )
        schedule(
            '30 12 * * *',
            this._execWin.bind(this),
            { timezone: 'America/Lima' }
        )
    }

    private async _execWin() {
        const start = new Date()
        const startTime = start.toLocaleString('es-PE', { timeZone: 'America/Lima' })
        try {
            if (this.scraping_data_win) {
                console.warn(`[${this.jobNameWin}] ⚠️ Ya hay una ejecución en curso. Saltando (${startTime})`)
                return
            }

            this.scraping_data_win = true
            console.info(`[${this.jobNameWin}] ▶️  Inicio de ejecución a las      ${startTime}`)

            await BootstrapWIN()
            const end = new Date()
            const endTime = end.toLocaleString('es-PE', { timeZone: 'America/Lima' })
            const durationSec = ((end.getTime() - start.getTime()) / 1000).toFixed(2)
            console.info(`[${this.jobNameWin}] ✅ Finalizado correctamente a las ${endTime} (${durationSec}s)`)
        } catch (error) {
            const end = new Date()
            const endTime = end.toLocaleString('es-PE', { timeZone: 'America/Lima' })
            const durationSec = ((end.getTime() - start.getTime()) / 1000).toFixed(2)
            console.error(`[${this.jobNameWin}] ❌ Error durante la ejecución a las ${endTime} (${durationSec}s):`, (error as Error).message)

            console.error(error)
            const instance = new MailService()
            try {
                await instance.send(ENV.DEVS_EMAILS, `Error en scraper WIN`, (error as Error).message)
                console.info(`[${this.jobNameWin}] 📧 Correo de error enviado correctamente`)
            } catch (mailErr) {
                console.error(`[${this.jobNameWin}] 🔴 Error al enviar correo de notificación:`, mailErr)
            }
        } finally {
            this.scraping_data_win = false
            console.info(`[${this.jobNameWin}] 💤 Job listo para la siguiente ejecución`)
        }
    }
}

new Job()