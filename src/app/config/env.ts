import dotenv from "dotenv"

dotenv.config()

interface IEnvConfig {
  DATABASE_URL: string;
  PORT: string;
  BCRYPT_SALT_COUNT: string;
  JWT_ACCESS_SECRET_KEY: string;
  JWT_ACCESS_EXPIRES_IN: string;
  JWT_REFRESH_SECRET_KEY: string;
  JWT_REFRESH_EXPIRES_IN: string;
  ADMIN_Email: string;
  ADMIN_PASS: string;
  ADMIN_PHONE: string;
  ADMIN_NAME: string;
  ADMIN_LOCATION: string;
}

const loadEnvVars = ():IEnvConfig =>{
    const requiredEnvVar: string[] = [
      "DATABASE_URL",
      "PORT",
      "BCRYPT_SALT_COUNT",
      "JWT_ACCESS_SECRET_KEY",
      "JWT_ACCESS_EXPIRES_IN",
      "JWT_REFRESH_SECRET_KEY",
      "JWT_REFRESH_EXPIRES_IN",
      "ADMIN_Email",
      "ADMIN_PASS",
      "ADMIN_PHONE",
      "ADMIN_NAME",
      "ADMIN_LOCATION"
    ];

    requiredEnvVar.forEach(key=>{
        if(!process.env[key]){
            throw new Error(`Missing Env Variable of ${key}`)
        }
    })

    return {
      DATABASE_URL: process.env.DATABASE_URL as string,
      PORT: process.env.PORT as string,
      BCRYPT_SALT_COUNT:process.env.BCRYPT_SALT_COUNT as string,
      JWT_ACCESS_SECRET_KEY: process.env.JWT_ACCESS_SECRET_KEY as string,
      JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN as string,
      JWT_REFRESH_SECRET_KEY: process.env.JWT_REFRESH_SECRET_KEY as string,
      JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN as string,
      ADMIN_Email: process.env.ADMIN_Email as string,
      ADMIN_PASS: process.env.ADMIN_PASS as string,
      ADMIN_PHONE: process.env.ADMIN_PHONE as string,
      ADMIN_NAME: process.env.ADMIN_NAME as string,
      ADMIN_LOCATION: process.env.ADMIN_LOCATION as string
    };
}

export const envVars = loadEnvVars()