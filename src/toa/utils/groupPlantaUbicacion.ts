import { PlantaDTO, UbicacionDTO } from "../domain"

export function groupPlantaUbicacion(el: any) {
    const Planta: PlantaDTO = {
        Tap: el.Tap ?? 0,
        Amplificador: el.Amplificador ?? '',
        Nodo: el.Nodo ?? '',
        Troba: el.Troba ?? '',
        'Estado del Borne': el['Estado del Borne'] ?? '',
        'Rotulado del CTO': el['Rotulado del CTO'] ?? '',
        'Datos Borne': el['Datos Borne'] ?? 0,
    }
    el.Planta = Planta

    el.Localidad = el.Localidad && typeof el.Localidad === 'number'
        ? el.Localidad.toString()
        : el.Localidad

    const Ubicacion: UbicacionDTO = {
        Localidad: el.Localidad ?? '',
        Dirección: el.Dirección ?? '',
        'Clave Zona de Trabajo': el['Clave Zona de Trabajo'] ?? '',
        'Zona de Trabajo': el['Zona de Trabajo'] ?? '',
        Departamento: el.Departamento ?? '',
    }
    el.Ubicacion = Ubicacion
}