import 'reflect-metadata/lite'
import cron from "node-cron";
import { BootstrapTOA } from "./toa";
import { ENV } from './config';

async function startScheduler() {
    try {
        cron.schedule(`${ENV.TOA_EXECUTION_TMINUTE} ${ENV.TOA_EXECUTION_HOUR} * * *`, async () => {
            try {
                await BootstrapTOA()
            } catch (error) {
                console.error(error)
                // Send Mail
            }
        })

        if (ENV.NODE_ENV === 'development') {
            await BootstrapTOA()
        }

        console.log(`✅ Jobs programados con cron`)
    } catch (error) {
        console.error(error);
    }
}

startScheduler();
