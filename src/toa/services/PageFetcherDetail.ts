import { HTTPResponse, Page } from 'puppeteer-core';
import { IBodyDetail } from '../domain';

export class PageFetcherDetail {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    public async fetchData(response: HTTPResponse, data: IBodyDetail) {
        const originalRequest = response.request()
        const headers = originalRequest.headers()

        const newResponse = await this.page.evaluate(
            async ({ url, headers, bodyOverrides }) => {
                // 🔹 Crear FormData desde cero
                const formData = new FormData();
                formData.append('__protocol', '7');
                formData.append('f', 'json');
                for (const [key, value] of Object.entries(bodyOverrides)) {
                    formData.append(key, value.toString());
                }

                const res = await fetch(url, {
                    method: 'POST',
                    headers: { ...headers },
                    body: formData,
                });

                return res.json();
            },
            {
                url: originalRequest.url(),
                headers: Object.fromEntries(
                    Object.entries(headers).filter(([k]) => k.toLowerCase() !== 'content-type')
                ),
                bodyOverrides: {
                    ...data,
                    trust: await this.page.evaluate(() => (window as any).$app.sessionManager().getTrustedConnectHash())
                }
            }
        )

        console.log('🔁 Respuesta modificada:', newResponse.server);
        return newResponse.server
    }
}
