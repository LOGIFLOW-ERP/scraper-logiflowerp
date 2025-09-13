import { parseDateTimeSettlementDate } from "./parseDateTime"

export function getSettlementDate(params: any, inv_aid: number): Date {
    for (const key in params.delta.Activity) {
        if (key === inv_aid.toString()) {
            const value = params.delta.Activity[key]
            const result = value['activity_end_time']
            return parseDateTimeSettlementDate(result)
        }
    }
    throw new Error('No hay fecha')
}