import { parseDateTimeSettlementDate } from "./parseDateTime"

export function getSettlementDate(params: any, inv_aid: number, _key: string): Date {
    for (const key in params.delta.Activity) {
        if (key === inv_aid.toString()) {
            const value = params.delta.Activity[key]
            const result = value[_key]
            if (_key === '2456' && result === undefined) {
                return new Date(0)
            }
            return parseDateTimeSettlementDate(result)
        }
    }
    if (_key === 'last_update_date') {
        return new Date(0)
    }
    throw new Error(`No hay fecha ${_key}`)
}