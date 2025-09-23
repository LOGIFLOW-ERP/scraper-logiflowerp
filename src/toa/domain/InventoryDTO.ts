import { Expose } from "class-transformer";
import { IsDefined, IsEnum, IsIn, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";
import { StateInventory } from "logiflowerp-sdk";

export class InventoryDTO {
    @IsDefined({ message: 'code es requerido' })
    @IsString()
    @IsNotEmpty()
    @Expose()
    code!: string;

    @IsDefined({ message: 'description es requerido' })
    @IsString()
    @IsNotEmpty()
    @Expose()
    description!: string;

    @IsDefined({ message: 'lot es requerido' })
    @IsString()
    @Expose()
    lot!: string;

    @IsDefined({ message: 'quantity es requerido' })
    @IsNumber()
    @Min(1)
    @Expose()
    quantity!: number;

    @IsDefined({ message: 'invsn es requerido' })
    @IsString()
    @Expose()
    invsn!: string;

    @IsDefined({ message: 'invtype es requerido' })
    @IsString()
    @IsNotEmpty()
    @Expose()
    invtype!: string;

    @IsDefined({ message: 'invpool es requerido' })
    @IsIn(['deinstall', 'install'])
    @Expose()
    invpool!: 'deinstall' | 'install';

    @Expose()
    @IsDefined({ message: "El campo Estado es obligatorio." })
    @IsEnum(StateInventory, { message: "El campo Estado debe ser uno de: PENDIENTE, PROCESADO." })
    State!: StateInventory
}