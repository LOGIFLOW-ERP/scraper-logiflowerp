import { parseDateTimeSettlementDate } from "./parseDateTime"

export function getSettlementDate(params: any, inv_aid: number, _key: string): Date {
    for (const key in params.delta.Activity) {
        if (key === inv_aid.toString()) {
            const value = params.delta.Activity[key]
            const result = value[_key]
            return parseDateTimeSettlementDate(result)
        }
    }
    throw new Error('No hay fecha')
}