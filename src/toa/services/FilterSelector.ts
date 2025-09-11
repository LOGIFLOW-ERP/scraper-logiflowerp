import { Page } from "puppeteer-core";

export class FilterSelector {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    private async waitAndClick(selector: string, timeout = 10000) {
        await this.page.waitForSelector(selector, { visible: true, timeout });
        await this.page.click(selector);
    }

    private async isChecked(selector: string): Promise<boolean> {
        return await this.page.$eval(selector, el => (el as HTMLInputElement).checked);
    }

    public async selectAllChildrenData() {
        console.log('⌛ Seleccionando filtro "Todos los datos de hijos"...');

        // 1. Abrir menú "Vista"
        await this.waitAndClick('button[title="Vista"]');

        // 2. Marcar checkbox si no está marcado
        const checkboxSelector = 'input[type="checkbox"][value="1"]';
        await this.page.waitForSelector(checkboxSelector, { visible: true, timeout: 10000 });

        if (!(await this.isChecked(checkboxSelector))) {
            await this.page.click(checkboxSelector);
        }

        // 3. Aplicar cambios
        const aplicarButtonSelector =
            '[id^="toolbar-switcher-container"][id$="__top_panel__viewFilter"] .applyButtonWrapper button';
        await this.waitAndClick(aplicarButtonSelector);

        console.log('✅ Filtro "Todos los datos de hijos" seleccionado.');
    }
}
