import { Expose } from "class-transformer";
import { IsDefined, IsIn, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

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
}