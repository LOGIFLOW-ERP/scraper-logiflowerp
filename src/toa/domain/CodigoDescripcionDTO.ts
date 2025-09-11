import { Expose } from "class-transformer"
import { IsDefined, IsString } from "class-validator"

export class CodigoDescripcionDTO {
    @IsDefined({ message: 'Envio de psi es requerido' })
    @IsString({ message: 'Envio de psi debe ser una cadena de texto' })
    @Expose()
    Codigo!: string

    @IsDefined({ message: 'Envio de psi es requerido' })
    @IsString({ message: 'Envio de psi debe ser una cadena de texto' })
    @Expose()
    Descripcion!: string
}