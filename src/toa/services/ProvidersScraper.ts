import { Page } from 'puppeteer-core';

export class ProvidersScraper {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async getProvidersId(providersId: string[]): Promise<void> {
        const selector = '#manage-content > div.toa-layout-fit.toa-twopanel.toa-twopanel-horizontal > div.toa-twopanel-first-panel.toa-twopanel.toa-twopanel-vertical div.edt-root[role="tree"] > div[role="treeitem"][data-id]';

        await this.page.waitForSelector(selector, { visible: true });

        const result = await this.page.$$eval(
            selector,
            elements => elements.map(el => el.getAttribute('data-id')!)
        );

        providersId.push(...result);
    }
}
