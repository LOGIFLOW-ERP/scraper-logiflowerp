import { get } from "env-var";

export const ENV = Object.freeze({
    HOST_API: get("HOST_API").required().asUrlString(),
    MONGO_URI: get("MONGO_URI").required().asUrlString(),
    EMAIL_USER: get('EMAIL_USER').required().asEmailString(),
    EMAIL_PASS: get('EMAIL_PASS').required().asString(),
    SMTP_HOST: get('SMTP_HOST').required().asString(),
    SMTP_PORT: get('SMTP_PORT').required().asInt(),
    SMTP_SECURE: get('SMTP_SECURE').required().asBool(),
    NODE_ENV: get('NODE_ENV').required().asEnum(['development', 'qa', 'production']),
    EXECUTABLE_PATH: get('EXECUTABLE_PATH').required().asString(),
    // TOA_EXECUTION_HOUR: get('TOA_EXECUTION_HOUR').required().asIntPositive(),
    // TOA_EXECUTION_TMINUTE: get('TOA_EXECUTION_TMINUTE').required().asIntPositive(),
    LOOKBACK_DAYS: get('LOOKBACK_DAYS').required().asIntPositive(),
    TOKEN: get('TOKEN').required().asString(),
    DEVS_EMAILS: get('DEVS_EMAILS').required().asArray(),
})