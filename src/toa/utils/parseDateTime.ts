export function parseDateTimeSettlementDate(dateTimeStr: string) {
    // Espera formato "YYYY-MM-DD HH:mm:ss"
    if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateTimeStr)) {
        throw new Error('formato inválido')
    }

    // Reemplaza el espacio por T para cumplir ISO 8601
    const isoString = dateTimeStr.replace(" ", "T")

    const date = new Date(isoString)

    if (isNaN(date.getTime())) {
        throw new Error('formato inválido (1)')
    }

    return date
}

/**
 * Convierte una fecha en formato string "DD/MM/AA" o "DD/MM/AAAA" a un objeto Date.
 *
 * 📌 Características:
 * - Si recibe un objeto `Date` válido, lo retorna tal cual.
 * - Si recibe un string, valida formato y rango (días/meses correctos).
 * - Soporta:
 *    - "DD/MM/AA" → siempre interpreta AA como 20XX (ej. "25" → 2025).
 *    - "DD/MM/AAAA" → usa directamente el año.
 * - Valida correctamente los años bisiestos (29/02).
 * - Devuelve `null` si el formato o fecha son inválidos.
 *
 * ⚠️ Limitación:
 * - Los años de 2 dígitos **solo** se interpretan entre 2000 y 2099.
 *   No funciona para fechas fuera de este rango si usas AA.
 *
 * @param fecha - Fecha a convertir (Date o string)
 * @returns Objeto Date válido o null si es inválido
 */
export function parseFechaDeCita(fecha: any): Date | null {
    // Si ya es un Date válido, devolver tal cual
    if (fecha instanceof Date && !isNaN(fecha.getTime())) {
        return fecha;
    }

    // Solo procesamos strings
    if (typeof fecha !== 'string') return null;

    /**
     * Explicación del regex:
     * - Valida días y meses correctos:
     *    - 31 solo en meses con 31 días (01,03,05,07,08,10,12).
     *    - 30 en meses válidos.
     *    - 29/02 se permite, luego se valida bisiesto en código.
     * - Año puede ser 2 dígitos (\d{2}) o 4 dígitos (\d{4}).
     */
    const regex = /^(?:(?:31\/(?:0[13578]|1[02]))|(?:30\/(?:0[13-9]|1[0-2]))|(?:0[1-9]|1\d|2[0-8])\/(?:0[1-9]|1[0-2]))\/(?:\d{2}|\d{4})$|^29\/02\/(?:\d{2}|\d{4})$/;

    // Si no pasa regex, es inválido
    if (!regex.test(fecha)) return null;

    const [diaStr, mesStr, anioStr] = fecha.split('/');
    const dia = Number(diaStr);
    const mes = Number(mesStr);

    // Interpretar año: 2 dígitos siempre como 20XX
    const anio = anioStr.length === 2
        ? 2000 + Number(anioStr) // Ej. "25" → 2025
        : Number(anioStr);

    // Validación extra para 29/02 (bisiesto)
    if (mes === 2 && dia === 29) {
        const esBisiesto = (anio % 4 === 0 && anio % 100 !== 0) || anio % 400 === 0;
        if (!esBisiesto) return null;
    }

    // Retornar Date
    return new Date(anio, mes - 1, dia);
}