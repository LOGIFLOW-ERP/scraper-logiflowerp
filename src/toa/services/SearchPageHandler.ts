import { ScrapingCredentialDTO } from 'logiflowerp-sdk'
import { Page, HTTPResponse } from 'puppeteer-core'

export class SearchPageHandler {
    private page: Page
    private targetUrl: string

    constructor(page: Page, targetToa: ScrapingCredentialDTO) {
        this.page = page
        this.targetUrl = `${targetToa.url}/?m=sync&a=write&ajax=1&window_id=`.toLowerCase()
    }

    private async wait(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    public async searchAndSelectItem(searchTerm: string = 'FE-1100340629'): Promise<HTTPResponse> {
        const responsePromise = this.page.waitForResponse(
            (response) =>
                response.url().toLowerCase().startsWith(this.targetUrl) &&
                response.request().method() === 'POST'
        )

        await this.page.waitForSelector('.search-bar-input');
        await this.page.click(".search-bar-input");
        await this.page.focus(".search-bar-input");

        await this.wait(2000)

        await this.page.click('.search-bar-input', { clickCount: 3 })
        await this.page.keyboard.press('Backspace')
        await this.page.type('.search-bar-input', searchTerm, { delay: 50 })

        await this.page.focus(".search-bar-input")
        await this.page.keyboard.press('Enter')
        await this.page.keyboard.press('Enter')
        await this.page.keyboard.press('Enter')

        await this.wait(3000)

        let element = null
        try {
            await this.page.waitForSelector('.found-item-activity', { timeout: 5000 })
            await this.wait(1000)

            element = await this.page.$('.found-item-activity')
        } catch {
            throw new Error("No se encontró ningún resultado en la búsqueda")
        }

        if (!element) {
            throw new Error('no hay ele')
        }

        await element.click()

        await this.wait(4000)

        return responsePromise
    }
}
