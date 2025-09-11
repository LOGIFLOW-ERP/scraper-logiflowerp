import { ENV } from '@/config';
import { LaunchOptions } from 'puppeteer-core';

export const PUPPETEER_CONFIG: LaunchOptions = {
    headless: ENV.NODE_ENV === 'production' || ENV.NODE_ENV === 'qa',
    defaultViewport: { width: 1280, height: 800 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: ENV.EXECUTABLE_PATH,
    timeout: 30000
};
