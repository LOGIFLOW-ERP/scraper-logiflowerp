import { Page } from 'puppeteer-core';

export class PageFetcher {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    public async fetchData(url: string) {
        return await this.page.evaluate(async (urlToFetch) => {
            try {
                const response = await fetch(urlToFetch);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(
                        `Error de Fetch en el navegador: ${response.status} ${response.statusText}`,
                        errorText.substring(0, 200)
                    );
                    throw new Error(
                        `Error HTTP en el navegador! status: ${response.status} - ${errorText.substring(0, 100)}`
                    );
                }

                const arrayBuffer = await response.arrayBuffer();
                return Array.from(new Uint8Array(arrayBuffer));
            } catch (error) {
                console.error(
                    'Error durante fetch en page.evaluate:',
                    (error as Error).message
                );
                throw error;
            }
        }, url);
    }
}
