import { Expose } from "class-transformer"
import { IsDefined, IsNumber, IsString } from "class-validator"

export class TrazabilidadDelPluginDTO {
    @IsDefined({ message: 'userPlugin es requerido' })
    @IsString({ message: 'userPlugin debe ser una cadena de texto' })
    @Expose()
    userPlugin!: string

    @IsDefined({ message: 'descriptionMove es requerido' })
    @IsString({ message: 'descriptionMove debe ser una cadena de texto' })
    @Expose()
    descriptionMove!: string

    @IsDefined({ message: 'updTime es requerido' })
    @IsString({ message: 'updTime debe ser una cadena de texto' })
    @Expose()
    updTime!: string

    @IsDefined({ message: 'originalDate es requerido' })
    @IsString({ message: 'originalDate debe ser una cadena de texto' })
    @Expose()
    originalDate!: string

    @IsDefined({ message: 'originalAppointmentType es requerido' })
    @IsString({ message: 'originalAppointmentType debe ser una cadena de texto' })
    @Expose()
    originalAppointmentType!: string

    @IsDefined({ message: 'originalSlot es requerido' })
    @IsString({ message: 'originalSlot debe ser una cadena de texto' })
    @Expose()
    originalSlot!: string

    @IsDefined({ message: 'originalResource es requerido' })
    @IsString({ message: 'originalResource debe ser una cadena de texto' })
    @Expose()
    originalResource!: string

    @IsDefined({ message: 'finalDate es requerido' })
    @IsString({ message: 'finalDate debe ser una cadena de texto' })
    @Expose()
    finalDate!: string

    @IsDefined({ message: 'finalAppointmentType es requerido' })
    @IsString({ message: 'finalAppointmentType debe ser una cadena de texto' })
    @Expose()
    finalAppointmentType!: string

    @IsDefined({ message: 'finalSlot es requerido' })
    @IsString({ message: 'finalSlot debe ser una cadena de texto' })
    @Expose()
    finalSlot!: string

    @IsDefined({ message: 'finalResource es requerido' })
    @IsString({ message: 'finalResource debe ser una cadena de texto' })
    @Expose()
    finalResource!: string

    @IsDefined({ message: 'activityId es requerido' })
    @IsNumber({}, { message: 'activityId debe ser un número' })
    @Expose()
    activityId!: string

    @IsDefined({ message: 'pluginStartTime es requerido' })
    @IsString({ message: 'pluginStartTime debe ser una cadena de texto' })
    @Expose()
    pluginStartTime!: string

    @IsDefined({ message: 'pluginDuration es requerido' })
    @IsString({ message: 'pluginDuration debe ser una cadena de texto' })
    @Expose()
    pluginDuration!: string

    @IsDefined({ message: 'indMov es requerido' })
    @IsString({ message: 'indMov debe ser una cadena de texto' })
    @Expose()
    indMov!: string
}