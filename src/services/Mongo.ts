import { Document, MongoClient, } from 'mongodb'
import { ENV } from '../config'
import { collections, db_root, EmployeeENTITY, RootCompanyENTITY, State, TOAOrderENTITY } from 'logiflowerp-sdk'

export class MongoService {
    private client: MongoClient
    private isConnected = false

    constructor() {
        this.client = new MongoClient(ENV.MONGO_URI)
    }

    private async connect() {
        if (!this.isConnected) {
            await this.client.connect()
            this.isConnected = true
        }
    }

    private async getCollection<T extends Document>(dbName: string, collectionName: string) {
        await this.connect()
        const db = this.client.db(dbName)
        return db.collection<T>(collectionName)
    }


    public async getActiveCompanies() {
        const companies = await this.getCollection<RootCompanyENTITY>(db_root, collections.company)

        const query = { state: State.ACTIVO, isDeleted: false }
        const projectFields = { _id: 1, code: 1, scrapingTargets: 1 } as const

        const activeCompanies = await companies
            .find<RootCompanyENTITY>(query)
            .project<Pick<RootCompanyENTITY, keyof typeof projectFields>>(projectFields)
            .toArray()
        return activeCompanies
    }

    public async getPersonnelCompany(code: string) {
        const personal = await this.getCollection<EmployeeENTITY>(code, collections.employee)

        const query = { state: State.ACTIVO, isDeleted: false }
        const projectFields = { _id: 1, toa_resource_id: 1 } as const

        const dataPersonal = await personal
            .find<EmployeeENTITY>(query)
            .project<Pick<EmployeeENTITY, keyof typeof projectFields>>(projectFields)
            .toArray()

        return dataPersonal
    }

    public async saveTOAOrders(code: string, orders: TOAOrderENTITY[]) {
        const toa_order = await this.getCollection<TOAOrderENTITY>(code, collections.toa_order)
        await toa_order.insertMany(orders)
    }

    public async close() {
        await this.client.close()
        this.isConnected = false
    }
}
