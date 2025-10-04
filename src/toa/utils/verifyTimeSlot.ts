export function verifyTimeSlot(params: any, inv_aid: number, orden: any) {
    if (typeof orden['Time Slot'] === 'string') {
        return
    }

    for (const key in params.delta.Activity) {
        if (key === inv_aid.toString()) {
            const value = params.delta.Activity[inv_aid]?._identifier_structure?.time_slot?.text
            if (value) {
                orden['Time Slot'] = value
                return
            }
        }
    }
    throw new Error(`No hay verifyTimeSlot`)
}