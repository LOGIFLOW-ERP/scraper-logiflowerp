import { StateInventory } from "logiflowerp-sdk";
import { InventoryDTO } from "../domain/InventoryDTO";

export function getDataInventory(params: any, inv_aid: number) {
    const data: InventoryDTO[] = []

    for (const key in params.delta.Inventory) {
        const value = params.delta.Inventory[key]
        if (value.inv_aid === inv_aid && ['install', 'deinstall'].includes(value.invpool)) {
            const code = value['1620'] ?? value['1624']
            const description = value.invpool === 'deinstall' ? value['1619'] : value._identifier_structure['1646'].text
            const lot = value._identifier_structure['287']?.text ?? ''
            const invsn = value._identifier_structure.invsn?.text ?? ''
            const quantity = invsn && value.quantity === undefined ? 1 : value.quantity
            const invtype = value._identifier_structure.invtype.text
            const invpool = value.invpool

            if (code === undefined && value.invpool === 'deinstall') {
                continue
            }

            data.push(
                {
                    code,
                    description,
                    lot,
                    quantity,
                    invsn,
                    invtype,
                    invpool,
                    State: StateInventory.PENDIENTE
                }
            )
        }
    }
    return data
}