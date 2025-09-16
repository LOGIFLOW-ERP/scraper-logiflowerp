import { IsArray, IsDate, IsDefined, IsNumber, IsObject, IsOptional, IsString, ValidateIf, ValidateNested } from "class-validator"
import { CodigoDescripcionDTO } from "./CodigoDescripcionDTO"
import { Expose, Type } from "class-transformer"
import { TrazabilidadDelPluginDTO } from "./TrazabilidadDelPluginDTO"
import { InventoryDTO } from "./InventoryDTO"
import { parseCustomDate } from "../utils"
import { ProductsServicesContractedDTO } from "./ProductsServicesContractedDTO"
import { PlantaDTO } from "./PlantaDTO"
import { UbicacionDTO } from "./UbicacionDTO"

export class DataScraperTOAENTITY {
    @IsDefined({ message: 'Técnico es requerido' })
    @IsString({ message: 'Técnico debe ser una cadena de texto' })
    @Expose()
    Técnico!: string

    @IsDefined({ message: 'ID Recurso es requerido' })
    @IsNumber({}, { message: 'ID Recurso debe ser un número' })
    @Expose()
    'ID Recurso': number

    @IsDefined({ message: 'Número OT es requerido' })
    @IsNumber({}, { message: 'Número OT debe ser un número' })
    @Expose()
    'Número OT': number

    @IsDefined({ message: 'Subtipo de Actividad es requerido' })
    @IsString({ message: 'Subtipo de Actividad debe ser una cadena de texto' })
    @Expose()
    'Subtipo de Actividad': string

    @IsOptional()
    @IsString({ message: 'Número de Petición debe ser una cadena de texto' })
    @Expose()
    'Número de Petición'?: string

    @IsDefined({ message: 'Fecha de Cita es requerido' })
    @IsDate({ message: 'Fecha de Cita debe ser una fecha' })
    @Expose()
    'Fecha de Cita': Date

    @IsOptional()
    @ValidateIf((o) => typeof o['Time Slot'] === 'number')
    @IsNumber({}, { message: 'Time Slot debe ser un número cuando es numérico' })
    @ValidateIf((o) => typeof o['Time Slot'] === 'string')
    @IsString({ message: 'Time Slot debe ser un texto cuando es string' })
    @Expose()
    'Time Slot'?: string | number;

    @IsOptional()
    @IsNumber({}, { message: 'Direccion Polar X debe ser un número' })
    @Expose()
    'Direccion Polar X'?: number

    @IsOptional()
    @IsNumber({}, { message: 'Direccion Polar Y debe ser un número' })
    @Expose()
    'Direccion Polar Y'?: number

    @IsOptional()
    @IsString({ message: 'Nombre Cliente debe ser una cadena de texto' })
    @Expose()
    'Nombre Cliente'?: string

    @IsDefined({ message: 'Tiempo de Viaje es requerido' })
    @IsString({ message: 'Tiempo de Viaje debe ser una cadena de texto' })
    @Expose()
    'Tiempo de Viaje': string

    @IsDefined({ message: 'Duración de la actividad es requerido' })
    @IsString({ message: 'Duración de la actividad debe ser una cadena de texto' })
    @Expose()
    'Duración de la actividad': string

    @IsOptional()
    @IsString({ message: 'Habilidad del trabajo debe ser una cadena de texto' })
    @Expose()
    'Habilidad del trabajo'?: string

    @IsDefined({ message: 'Estado actividad es requerido' })
    @IsString({ message: 'Estado actividad debe ser una cadena de texto' })
    @Expose()
    'Estado actividad': string

    @IsOptional()
    @IsString({ message: 'Categoría de Capacidad debe ser una cadena de texto' })
    @Expose()
    'Categoría de Capacidad'?: string

    @IsOptional()
    @IsString({ message: 'Tecnología Voz debe ser una cadena de texto' })
    @Expose()
    'Tecnología Voz'?: string

    @IsDefined({ message: 'Validación Técnica es requerido' })
    @IsString({ message: 'Validación Técnica debe ser una cadena de texto' })
    @Expose()
    'Validación Técnica': string

    @IsDefined({ message: 'Zona Rural es requerido' })
    @IsString({ message: 'Zona Rural debe ser una cadena de texto' })
    @Expose()
    'Zona Rural': string

    @IsDefined({ message: 'Indicador de Zona peligrosa es requerido' })
    @IsString({ message: 'Indicador de Zona peligrosa debe ser una cadena de texto' })
    @Expose()
    'Indicador de Zona peligrosa': string

    @IsDefined({ message: 'Enrutado automático a recurso es requerido' })
    @IsNumber({}, { message: 'Enrutado automático a recurso debe ser un número' })
    @Expose()
    'Enrutado automático a recurso': number

    @IsDefined({ message: 'Secuencia en Ruta es requerido' })
    @IsNumber({}, { message: 'Secuencia en Ruta debe ser un número' })
    @Expose()
    'Secuencia en Ruta': number

    @IsDefined({ message: 'Primera operación manual realizada por usuario es requerido' })
    @IsNumber({}, { message: 'Primera operación manual realizada por usuario debe ser un número' })
    @Expose()
    'Primera operación manual realizada por usuario': number

    @IsDefined({ message: 'Fecha de Registro Legados es requerido' })
    @IsDate({ message: 'Fecha de Registro Legados debe ser una fecha' })
    @Expose()
    'Fecha de Registro Legados': Date

    @IsOptional()
    @IsString({ message: 'Usuario debe ser una cadena de texto' })
    @Expose()
    Usuario?: string

    @IsOptional()
    @IsString({ message: 'Tipo de Cita debe ser una cadena de texto' })
    @Expose()
    'Tipo de Cita'?: string

    @IsOptional()
    @IsString({ message: 'Observaciones en Legados debe ser una cadena de texto' })
    @Expose()
    'Observaciones en Legados'?: string

    @IsDefined({ message: 'Autoriza Completar Actividad es requerido' })
    @IsString({ message: 'Autoriza Completar Actividad debe ser una cadena de texto' })
    @Expose()
    'Autoriza Completar Actividad': string

    @IsDefined({ message: 'Autoriza Suspender Actividad es requerido' })
    @IsString({ message: 'Autoriza Suspender Actividad debe ser una cadena de texto' })
    @Expose()
    'Autoriza Suspender Actividad': string

    @IsDefined({ message: 'Autoriza Validar Coordenadas es requerido' })
    @IsString({ message: 'Autoriza Validar Coordenadas debe ser una cadena de texto' })
    @Expose()
    'Autoriza Validar Coordenadas': string

    @IsDefined({ message: 'Autoriza Probar Módem es requerido' })
    @IsString({ message: 'Autoriza Probar Módem debe ser una cadena de texto' })
    @Expose()
    'Autoriza Probar Módem': string

    @IsOptional()
    @IsNumber({}, { message: 'Código de Cliente debe ser un número' })
    @Expose()
    'Código de Cliente'?: number

    @IsDefined({ message: 'Código Cierre Cancelada es requerido' })
    @IsString({ message: 'Código Cierre Cancelada debe ser una cadena de texto' })
    @Expose()
    'Código Cierre Cancelada': string

    @IsOptional()
    @IsDate({ message: 'Fecha Hora de Cancelación debe ser una fecha' })
    @Expose()
    'Fecha Hora de Cancelación'?: Date

    @IsOptional()
    @IsString({ message: 'Empresa debe ser una cadena de texto' })
    @Expose()
    Empresa?: string

    @IsOptional()
    @IsString({ message: 'Bucket Inicial debe ser una cadena de texto' })
    @Expose()
    'Bucket Inicial'?: string

    @IsOptional()
    @IsDate({ message: 'Fecha Registro de Actividad en TOA debe ser una fecha' })
    @Expose()
    'Fecha Registro de Actividad en TOA'?: Date

    @IsOptional()
    @IsNumber({}, { message: 'Coordenada X dirección tap debe ser un número' })
    @Expose()
    'Coordenada X dirección tap'?: number

    @IsOptional()
    @IsNumber({}, { message: 'Coordenada y dirección tap debe ser un número' })
    @Expose()
    'Coordenada y dirección tap'?: number

    @IsOptional()
    @IsString({ message: 'Nombre Distrito debe ser una cadena de texto' })
    @Expose()
    'Nombre Distrito'?: string

    @IsDefined({ message: 'Actividad - Coordenadas X es requerido' })
    @IsNumber({}, { message: 'Actividad - Coordenadas X debe ser un número' })
    @Expose()
    'Actividad - Coordenadas X': number

    @IsDefined({ message: 'Actividad - Coordenadas Y es requerido' })
    @IsNumber({}, { message: 'Actividad - Coordenadas Y debe ser un número' })
    @Expose()
    'Actividad - Coordenadas Y': number

    @IsDefined({ message: 'Indicador de Cambio de XY es requerido' })
    @IsString({ message: 'Indicador de Cambio de XY debe ser una cadena de texto' })
    @Expose()
    'Indicador de Cambio de XY': string

    @IsOptional()
    @IsString({ message: 'Tipo de Tecnología Legados debe ser una cadena de texto' })
    @Expose()
    'Tipo de Tecnología Legados'?: string

    @IsOptional()
    @IsString({ message: 'Velocidad Internet Requerimiento debe ser una cadena de texto' })
    @Expose()
    'Velocidad Internet Requerimiento'?: string

    @IsDefined({ message: 'Envio de psi es requerido' })
    @IsString({ message: 'Envio de psi debe ser una cadena de texto' })
    @Expose()
    'Envio de psi': string

    @IsOptional()
    @IsNumber({}, { message: 'Número Teléfono debe ser un número' })
    @Expose()
    'Número Teléfono'?: number

    @IsDefined({ message: 'Segmento es requerido' })
    @Type(() => CodigoDescripcionDTO)
    @IsObject({ message: "Segmento debe ser un objeto." })
    @ValidateNested({})
    @Expose()
    Segmento!: CodigoDescripcionDTO

    @IsOptional()
    @IsString({ message: 'Sistema Origen debe ser una cadena de texto' })
    @Expose()
    'Sistema Origen'?: string

    @IsOptional()
    @IsString({ message: 'Estado de Soporte de Planta 101 debe ser una cadena de texto' })
    @Expose()
    'Estado de Soporte de Planta 101'?: string

    @IsOptional()
    @IsDate({ message: 'Fecha Respuesta de Soporte de Planta 101 debe ser una fecha' })
    @Expose()
    'Fecha Respuesta de Soporte de Planta 101'?: Date

    @IsOptional()
    @IsString({ message: 'Observación Respuesta de Soporte de Planta 101 debe ser una cadena de texto' })
    @Expose()
    'Observación Respuesta de Soporte de Planta 101'?: string

    @IsOptional()
    @IsNumber({}, { message: 'AccessID debe ser un número' })
    @Expose()
    AccessID?: number

    @IsDefined({ message: 'Nombre de Contrata Final es requerido' })
    @IsString({ message: 'Nombre de Contrata Final debe ser una cadena de texto' })
    @Expose()
    'Nombre de Contrata Final': string

    @IsOptional()
    @IsString({ message: 'Ofertas de Productos/Servicios debe ser una cadena de texto' })
    @Expose()
    'Ofertas de Productos/Servicios'?: string

    @IsOptional()
    @IsString({ message: 'Indicador de Cambio de Tecnología debe ser una cadena de texto' })
    @Expose()
    'Indicador de Cambio de Tecnología'?: string

    @IsOptional()
    @IsString({ message: 'Tipo de Operación debe ser una cadena de texto' })
    @Expose()
    'Tipo de Operación'?: string

    @IsOptional()
    @IsString({ message: 'Quiebres debe ser una cadena de texto' })
    @Expose()
    Quiebres?: string

    @IsDefined({ message: 'Tipo de actividad es requerido' })
    @IsString({ message: 'Tipo de actividad debe ser una cadena de texto' })
    @Expose()
    'Tipo de actividad': string

    @IsDefined({ message: 'Equipo Obsoleto es requerido' })
    @IsString({ message: 'Equipo Obsoleto debe ser una cadena de texto' })
    @Expose()
    'Equipo Obsoleto': string

    @IsDefined({ message: 'Nombre de Provincia es requerido' })
    @ValidateIf((o) => typeof o['Nombre de Provincia'] === 'number')
    @IsNumber({}, { message: 'Nombre de Provincia debe ser un número cuando es numérico' })
    @ValidateIf((o) => typeof o['Nombre de Provincia'] === 'string')
    @IsString({ message: 'Nombre de Provincia debe ser un texto cuando es string' })
    @Expose()
    'Nombre de Provincia': string | number

    @IsOptional()
    @IsString({ message: 'Prioridad debe ser una cadena de texto' })
    @Expose()
    Prioridad?: string

    @IsOptional()
    @IsString({ message: 'Orden Pangea debe ser una cadena de texto' })
    @Expose()
    'Orden Pangea'?: string

    @IsDefined({ message: 'Reiterada TDI es requerido' })
    @IsString({ message: 'Reiterada TDI debe ser una cadena de texto' })
    @Expose()
    'Reiterada TDI': string

    @IsDefined({ message: 'Recurso Actual es requerido' })
    @IsString({ message: 'Recurso Actual debe ser una cadena de texto' })
    @Expose()
    'Recurso Actual': string

    @IsOptional()
    @IsString({ message: 'Tecnología TV debe ser una cadena de texto' })
    @Expose()
    'Tecnología TV'?: string

    @IsOptional()
    @IsString({ message: 'Indicador de Stopeo debe ser una cadena de texto' })
    @Expose()
    'Indicador de Stopeo'?: string

    @IsDefined({ message: 'Indicador Contrata Migradora es requerido' })
    @IsString({ message: 'Indicador Contrata Migradora debe ser una cadena de texto' })
    @Expose()
    'Indicador Contrata Migradora': string

    @IsOptional()
    @IsString({ message: 'Canal de agendamiento debe ser una cadena de texto' })
    @Expose()
    'Canal de agendamiento'?: string

    @IsOptional()
    @IsString({ message: 'Usuario de agendamiento debe ser una cadena de texto' })
    @Expose()
    'Usuario de agendamiento'?: string

    @IsOptional()
    @IsDate({ message: 'Fecha de agendamiento debe ser una fecha' })
    @Expose()
    'Fecha de agendamiento'?: Date

    @IsOptional()
    @IsString({ message: 'Franja de agendamiento debe ser una cadena de texto' })
    @Expose()
    'Franja de agendamiento'?: string

    @IsDefined({ message: 'Indicador Migra x AVeria es requerido' })
    @IsString({ message: 'Indicador Migra x AVeria debe ser una cadena de texto' })
    @Expose()
    'Indicador Migra x AVeria': string

    @IsDefined({ message: 'Direccion errada/incompleta es requerido' })
    @IsString({ message: 'Direccion errada/incompleta debe ser una cadena de texto' })
    @Expose()
    'Direccion errada/incompleta': string

    @IsOptional()
    @IsString({ message: 'ID de le sesión en botmaker debe ser una cadena de texto' })
    @Expose()
    'ID de le sesión en botmaker'?: string

    @IsOptional()
    @IsString({ message: 'Identificador de la plantilla a enviar a botmaker debe ser una cadena de texto' })
    @Expose()
    'Identificador de la plantilla a enviar a botmaker'?: string

    @IsDefined({ message: 'MigraxPeinado es requerido' })
    @IsString({ message: 'MigraxPeinado debe ser una cadena de texto' })
    @Expose()
    MigraxPeinado!: string

    @IsOptional()
    @IsString({ message: 'ID de le sesión en botmaker 10105 debe ser una cadena de texto' })
    @Expose()
    'ID de le sesión en botmaker 10105'?: string

    @IsOptional()
    @IsString({ message: 'Identificador de la plantilla a enviar a botmaker 10105 debe ser una cadena de texto' })
    @Expose()
    'Identificador de la plantilla a enviar a botmaker 10105'?: string

    @IsOptional()
    @IsNumber({}, { message: 'Maqueta de Botmaker 10105 debe ser un número' })
    @Expose()
    'Maqueta de Botmaker 10105'?: number

    @IsDefined({ message: 'Cliente acepta Solución Anticipada de Reclamo es requerido' })
    @IsString({ message: 'Cliente acepta Solución Anticipada de Reclamo debe ser una cadena de texto' })
    @Expose()
    'Cliente acepta Solución Anticipada de Reclamo': string

    @IsDefined({ message: 'Averia por MxA es requerido' })
    @IsString({ message: 'Averia por MxA debe ser una cadena de texto' })
    @Expose()
    'Averia por MxA': string

    @IsDefined({ message: 'PEDIDO RECUPERADO es requerido' })
    @IsString({ message: 'PEDIDO RECUPERADO debe ser una cadena de texto' })
    @Expose()
    'PEDIDO RECUPERADO': string

    @IsDefined({ message: 'REPROGRAMADO POR PRIORIDAD es requerido' })
    @IsString({ message: 'REPROGRAMADO POR PRIORIDAD debe ser una cadena de texto' })
    @Expose()
    'REPROGRAMADO POR PRIORIDAD': string

    // @IsDefined({ message: 'Trazabilidad del Plugin es requerido' })
    // @Type(() => TrazabilidadDelPluginDTO)
    // @IsArray({ message: 'Trazabilidad del Plugin debe ser un arreglo' })
    // @ValidateNested({ each: true })
    // @Expose()
    // 'Trazabilidad del Plugin': TrazabilidadDelPluginDTO[]

    @IsDefined({ message: 'Inventory es requerido' })
    @Type(() => InventoryDTO)
    @IsArray({ message: 'Inventory debe ser un arreglo' })
    @ValidateNested({ each: true })
    @Expose()
    Inventory!: InventoryDTO[]

    @IsDefined({ message: 'Planta es requerido' })
    @Type(() => PlantaDTO)
    @ValidateNested()
    @Expose()
    Planta!: PlantaDTO

    @IsDefined({ message: 'Ubicacion es requerido' })
    @Type(() => UbicacionDTO)
    @ValidateNested()
    @Expose()
    Ubicacion!: UbicacionDTO

    @IsDefined({ message: 'ProductsServicesContracted es requerido' })
    @Type(() => ProductsServicesContractedDTO)
    @IsArray({ message: 'ProductsServicesContracted debe ser un arreglo' })
    @ValidateNested({ each: true })
    @Expose()
    ProductsServicesContracted!: ProductsServicesContractedDTO[]

    @IsDefined({ message: 'SettlementDate es requerido' })
    @IsDate({ message: 'SettlementDate debe ser una fecha' })
    @Expose()
    SettlementDate!: Date
}