// const raw = '10/09/25 07:45 AM';

export function parseCustomDate(dateStr: string): Date {
    // Partimos manualmente porque el formato no es estándar ISO
    const [datePart, timePart, meridiem] = dateStr.split(' '); // ["10/09/25", "07:45", "AM"]
    const [day, month, year] = datePart.split('/').map(Number);
    let [hours, minutes] = timePart.split(':').map(Number);

    // Ajustar AM/PM
    if (meridiem === 'PM' && hours < 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;

    // Asumimos "25" es 2025 → ajusta si es otro siglo
    const fullYear = year < 50 ? 2000 + year : 1900 + year;

    return new Date(fullYear, month - 1, day, hours, minutes);
}
