import { Sequelize} from "sequelize-typescript";
import {Cards} from '../models/cards';
import {CardsItems} from "../models/cardsItems";



const connection = new Sequelize({
    dialect: "mysql",
    host: "localhost",
    username: "root",
    password: "",
    database: "trello",
    //logging: false,
    models: [Cards,CardsItems]
});

export default connection;