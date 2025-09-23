import { Expose } from "class-transformer"
import { IsDefined, IsNotEmpty, IsString } from "class-validator"

export class ProductsServicesContractedDTO {
  @IsDefined({ message: 'Código es requerido' })
  @IsString()
  @IsNotEmpty()
  @Expose()
  Código!: string

  @IsDefined({ message: 'Descripción es requerido' })
  @IsString()
  @IsNotEmpty()
  @Expose()
  Descripción!: string

  @IsDefined({ message: 'Código material es requerido' })
  @IsString()
  @Expose()
  'Código material': string

  @IsDefined({ message: 'Número Serie / Mac Address es requerido' })
  @IsString()
  @Expose()
  'Número Serie / Mac Address': string

  @IsDefined({ message: 'Tipo Equipo es requerido' })
  @IsString()
  @Expose()
  'Tipo Equipo': string
  // 'Código': '901'
  // 'Descripción': 'INSTALAR_MODEM_GPON_ONT_O_WIFI6'
  // 'Código material': '10406110490'
  // 'Número Serie / Mac Address': ''
  // 'Tipo Equipo': 'MODEM IAD'
  // Secuencia: '31'
  // 'Numero de componente por requerimiento': 'FE-1100340629-636076865'
  // 'Numero de componente por OT': ''
  // 'Numero de componente de servicio': ''
  // 'Tipo de Adquisición': 'Loan'
  // 'Equipos: Tipo de Procedencia': ''
  // Marca: ''
  // Modelo: ''
  // CasID: ''
  // Estado: ''
  // 'Equipos: Código Componente': '901'
  // 'Equipos: Descripción de Componentes': 'INSTALAR_MODEM_GPON_ONT_O_WIFI6'
}