import { Expose } from "class-transformer"
import { IsDefined, IsNumber, IsString } from "class-validator"

export class PlantaDTO {
    @IsDefined({ message: 'Tap es requerido' })
    @IsNumber({}, { message: 'Tap debe ser un número' })
    @Expose()
    Tap!: number

    @IsDefined({ message: 'Amplificador es requerido' })
    @IsString({ message: 'Amplificador debe ser una cadena de texto' })
    @Expose()
    Amplificador!: string

    @IsDefined({ message: 'Nodo es requerido' })
    @IsString({ message: 'Nodo debe ser una cadena de texto' })
    @Expose()
    Nodo!: string

    @IsDefined({ message: 'Troba es requerido' })
    @IsString({ message: 'Troba debe ser una cadena de texto' })
    @Expose()
    Troba!: string

    @IsDefined({ message: 'Estado del Borne es requerido' })
    @IsString({ message: 'Estado del Borne debe ser una cadena de texto' })
    @Expose()
    'Estado del Borne': string

    @IsDefined({ message: 'Rotulado del CTO es requerido' })
    @IsString({ message: 'Rotulado del CTO debe ser una cadena de texto' })
    @Expose()
    'Rotulado del CTO': string

    @IsDefined({ message: 'Datos Borne es requerido' })
    @IsNumber({}, { message: 'Datos Borne debe ser un número' })
    @Expose()
    'Datos Borne': number
}