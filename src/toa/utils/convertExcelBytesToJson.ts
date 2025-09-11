import * as XLSX from 'xlsx'

export const convertExcelBytesToJson = (byteArray: number[]): any[] => {
    const buffer = Buffer.from(byteArray)
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const firstSheet = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[firstSheet]
    return XLSX.utils.sheet_to_json(worksheet)
}
