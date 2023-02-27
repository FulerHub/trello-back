"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const cards_1 = require("../models/cards");
const cardsItems_1 = require("../models/cardsItems");
const connection = new sequelize_typescript_1.Sequelize({
    dialect: "mysql",
    host: "localhost",
    username: "root",
    password: "",
    database: "trello",
    //logging: false,
    models: [cards_1.Cards, cardsItems_1.CardsItems]
});
exports.default = connection;
