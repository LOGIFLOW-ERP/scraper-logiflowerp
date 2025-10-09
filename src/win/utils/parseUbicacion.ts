export function parseUbicacion(row: Record<string, any>) {
    row['Dirección Cliente'] = {
        Dirección: row.Dirección,
        'Código Postal': row['Código Postal'],
        Georeferencia: row.Georeferencia,
        'Sector Operativo': row['Sector Operativo'],
        Region: row.Region,
        Zona: row.Zona,
        Localidad_1: row.Localidad_1,
        Localidad_2: row.Localidad_2,
        Pais: row.Pais,
        Empresa: row.Empresa,
        'Tipo Ubicación': row['Tipo Ubicación'],
        Ubicación: row.Ubicación
    }
}