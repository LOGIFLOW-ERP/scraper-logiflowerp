import { Document, MongoClient, } from 'mongodb'
import { ENV } from '../config'
import {
    collections,
    db_root,
    EmployeeENTITY,
    RequestNumberTTLENTITY,
    RootCompanyENTITY,
    ScrapingCredentialENTITY,
    ScrapingSystem,
    State
} from 'logiflowerp-sdk'

const projectFields = { _id: 1, code: 1, scrapingTargets: 1 } as const

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

        const activeCompanies = await companies
            .find<RootCompanyENTITY>(query)
            .project<Pick<RootCompanyENTITY, keyof typeof projectFields>>(projectFields)
            .toArray()
        return activeCompanies
    }

    public async getPersonelCompanies(companies: Pick<RootCompanyENTITY, keyof typeof projectFields>[]) {
        const dataEmployees: EmployeeENTITY[] = []
        const query = { state: State.ACTIVO, isDeleted: false }
        for (const element of companies) {
            const col = await this.getCollection<EmployeeENTITY>(element.code, collections.employee)
            const result = await col.find(query).toArray()
            dataEmployees.push(...result)
        }
        return dataEmployees
    }

    public async getToaRequestNumberTTL() {
        const collection = await this.getCollection<RequestNumberTTLENTITY>(db_root, collections.toaRequestNumberTTL)
        return collection.find().toArray()
    }

    public async getWinRequestNumberTTL(db:string) {
        const collection = await this.getCollection<RequestNumberTTLENTITY>(db, collections.winRequestNumberTTL)
        return collection.find().toArray()
    }

    public async getScrapingCredentialTOA() {
        const companies = await this.getCollection<ScrapingCredentialENTITY>(db_root, collections.scrapingCredential)

        const query = { system: ScrapingSystem.TOA, isDeleted: false }

        const result = await companies
            .find<ScrapingCredentialENTITY>(query)
            .toArray()

        if (result.length !== 1) {
            throw new Error(`Hay ${result.length} resultados para credencial de scraping TOA`)
        }

        return result[0]
    }

    public async close() {
        await this.client.close()
        this.isConnected = false
    }
}
