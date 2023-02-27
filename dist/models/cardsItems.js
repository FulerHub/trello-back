"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardsItems = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const cards_1 = require("./cards");
let CardsItems = class CardsItems extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
], CardsItems.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(16384),
        allowNull: true
    })
], CardsItems.prototype, "cardsList", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => cards_1.Cards),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false
    })
], CardsItems.prototype, "listID", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => cards_1.Cards)
], CardsItems.prototype, "cards", void 0);
CardsItems = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        tableName: "cardsItems"
    })
], CardsItems);
exports.CardsItems = CardsItems;
