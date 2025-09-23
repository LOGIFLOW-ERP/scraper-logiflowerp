import { ValidationError } from "class-validator";

export const formatErrors = (errors: ValidationError[]): string => {
    return errors
        .map(err => {
            const constraints = err.constraints
                ? Object.values(err.constraints).join(', ')
                : 'Error desconocido';
            return `${err.property}: ${constraints}`
        })
        .join('; ')
}