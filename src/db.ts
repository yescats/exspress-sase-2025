import { configDotenv } from "dotenv";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Spot } from "./entities/Spot";

configDotenv()
export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [
        Spot, User
    ],
    logging: false
})