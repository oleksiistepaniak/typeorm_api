import 'reflect-metadata';
import { DataSource } from "typeorm";
import {User} from "../entities/User";
import {Product} from "../entities/Product";
import {Order} from "../entities/Order";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost", // process.env.DB_HOST
    port: 3306, // // process.env.DB_PORT
    username: "root", // process.env.DB_USERNAME
    password: "secret", // process.env.DB_PASSWORD
    database: "app_db", // process.env.DB_DATABASE

    // ONLY FOR LOCAL DEVELOPMENT
    synchronize: true,

    // ONLY FOR LOCAL DEVELOPMENT
    logging: true,

    entities: [User, Product, Order],
    subscribers: [],
    migrations: [],

})
