import 'reflect-metadata/lite'
import cron from "node-cron";
import { BootstrapTOA } from "./toa";
import { ENV } from './config';

async function startScheduler() {
    try {
        cron.schedule(`${ENV.TOA_EXECUTION_TMINUTE} ${ENV.TOA_EXECUTION_HOUR} * * *`, async () => {
            await BootstrapTOA()
        })

    } catch (error) {
        console.error(error);
    }
}

startScheduler();
