import 'reflect-metadata/lite'
import { BootstrapTOA } from './toa'
import { BootstrapWIN } from './win'
import { ENV } from './config'
import { schedule } from 'node-cron'
import { MailService, MongoService } from './services'
import { ScrapingSystem } from 'logiflowerp-sdk'

schedule(
    `*/30 * ${ENV.WIN_EXECUTION_START_HOUR}-${ENV.WIN_EXECUTION_END_HOUR} * * *`,
    async function _exec() {
        const mongoService = new MongoService()
        const filter = { system: ScrapingSystem.WIN, isDeleted: false }
        try {
            const scrapingCredential = await mongoService.getScrapingCredentialDBRoot(filter)

            if (scrapingCredential.updating_consumption) {
                return
            }

            await mongoService.updateScrapingCredentialDBRoot(filter, true)

            await BootstrapWIN()
        } catch (error) {
            console.error(error)
            const instance = new MailService()
            console.info('📧 Enviando mail...')
            try {
                await instance.send(ENV.DEVS_EMAILS, `Error en scraper WIN`, (error as Error).message)
                console.info('📧 Mail enviado.')
            } catch (error) {
                console.error('🔴🔴🔴 ERROR LA ENVIAR CORREO WIN 🔴🔴🔴', error)
            }
        } finally {
            await mongoService.updateScrapingCredentialDBRoot(filter, false)
        }
    },
    { timezone: 'America/Lima' }
)