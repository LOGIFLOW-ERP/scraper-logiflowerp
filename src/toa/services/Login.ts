import { ScrapingCredentialDTO } from 'logiflowerp-sdk'
import { Page } from 'puppeteer-core'

export class LoginService {
    private page: Page

    constructor(page: Page) {
        this.page = page
    }

    async login(targetToa: ScrapingCredentialDTO) {
        console.log('⌛ Iniciando sesión...')
        await this.page.goto(targetToa.url, { waitUntil: 'networkidle2' })

        // Espera y completa el formulario de login
        await this.page.waitForSelector('input[name="username"]', { visible: true })
        await this.page.type('input[name="username"]', targetToa.userName, { delay: 50 })
        await this.page.type('input[name="password"]', targetToa.password, { delay: 50 })

        // Envía el formulario y espera redirección
        await Promise.all([
            this.page.waitForNavigation({ waitUntil: 'networkidle2' }),
            this.page.click('button[type="submit"]')
        ])

        // 🔹 Comprueba si aparece el checkbox opcional
        const delSessionCheckbox = await this.page.$('#delsession')
        if (delSessionCheckbox) {
            console.log('ℹ️  Checkbox "Eliminar sesión" encontrado. Seleccionando...')
            await this.page.type('input[name="password"]', targetToa.password, { delay: 50 })
            await delSessionCheckbox.click()

            // Si hay otro submit, envía y espera
            await Promise.all([
                this.page.waitForNavigation({ waitUntil: 'networkidle2' }),
                this.page.click('button[type="submit"]')
            ])
        } else {
            console.log('ℹ️  Checkbox "Eliminar sesión" no encontrado. Continuando...')
        }

        console.log('✅ Login exitoso')
    }
}