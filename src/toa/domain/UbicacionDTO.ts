import { Expose } from "class-transformer"
import { IsDefined, IsString } from "class-validator"

export class UbicacionDTO {
    @IsDefined({ message: 'Localidad es requerido' })
    @IsString({ message: 'Localidad debe ser una cadena de texto' })
    @Expose()
    Localidad!: string

    @IsDefined({ message: 'Dirección es requerido' })
    @IsString({ message: 'Dirección debe ser una cadena de texto' })
    @Expose()
    Dirección!: string

    @IsDefined({ message: 'Clave Zona de Trabajo es requerido' })
    @IsString({ message: 'Clave Zona de Trabajo debe ser una cadena de texto' })
    @Expose()
    'Clave Zona de Trabajo': string

    @IsDefined({ message: 'Zona de Trabajo es requerido' })
    @IsString({ message: 'Zona de Trabajo debe ser una cadena de texto' })
    @Expose()
    'Zona de Trabajo': string

    @IsDefined({ message: 'Departamento es requerido' })
    @IsString({ message: 'Departamento debe ser una cadena de texto' })
    @Expose()
    Departamento!: string
}