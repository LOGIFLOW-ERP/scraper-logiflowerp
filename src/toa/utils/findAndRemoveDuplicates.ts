import { DataScraperTOAENTITY } from "../domain";

const resolver = (a: DataScraperTOAENTITY, b: DataScraperTOAENTITY) => {
    console.log(a)
    console.log(b)
    return new Date(a['last_update_date']).getTime() > new Date(b['last_update_date']).getTime() ? a : b;
}

export function findAndRemoveDuplicates(
    data: DataScraperTOAENTITY[]
) {
    const mapa = new Map<string, DataScraperTOAENTITY>();

    for (const element of data) {
        const key = element["Número de Petición"] as string;
        const existing = mapa.get(key);

        if (!existing) {
            mapa.set(key, element);
        } else {
            mapa.set(key, resolver(existing, element))
        }
    }

    return Array.from(mapa.values())
}

