"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cards_1 = require("../models/cards");
const cardsItems_1 = require("../models/cardsItems");
class CardsController {
    getCards(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cards = yield cards_1.Cards.findAll({
                    include: {
                        model: cardsItems_1.CardsItems
                    }
                });
                return res.status(200).json(cards);
            }
            catch (e) {
                res.status(400).json({ message: "Error: Can't get cards", error: e });
            }
        });
    }
    createCardList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { title } = req.body;
                const count = yield cards_1.Cards.count();
                const newCardList = yield cards_1.Cards.create({
                    title: title,
                    order: count + 1
                });
                const cardList = yield cards_1.Cards.findOne({ where: { id: newCardList.id }, include: {
                        model: cardsItems_1.CardsItems
                    } });
                return res.status(200).json(cardList);
            }
            catch (e) {
                res.status(400).json({ message: "Error: Can't create card list" });
            }
        });
    }
    updateCardListOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { list } = req.body;
                if (!list.length)
                    return res.status(400).json({ message: "Error: Can't update order list" });
                const cards = yield cards_1.Cards.findAll({
                    include: {
                        model: cardsItems_1.CardsItems
                    }
                });
                const listOrder = {};
                list.forEach((item) => {
                    listOrder[item.id] = item.order;
                });
                for (let card of cards) {
                    card.order = listOrder[card.id] ? listOrder[card.id] : card.order;
                    yield card.save();
                }
                // await cards.save();
                return res.status(200).json(cards);
            }
            catch (e) {
                res.status(400).json({ message: "Error: Can't update cards" });
            }
        });
    }
    updateCardList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { listID } = req.params;
                const list = yield cards_1.Cards.findOne({ where: { id: listID }, include: { model: cardsItems_1.CardsItems } });
                if (!list)
                    return res.status(404).json({ message: "Card list not found" });
                const { title } = req.body;
                list.title = title;
                yield list.save();
                return res.status(200).json(list);
            }
            catch (e) {
                res.status(400).json({ message: "Error: Can't update card list" });
            }
        });
    }
    updateCardSort(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { listID } = req.params;
                const list = yield cards_1.Cards.findOne({ where: { id: listID }, include: { model: cardsItems_1.CardsItems } });
                if (!list)
                    return res.status(404).json({ message: "Card list not found" });
                const cards = yield cardsItems_1.CardsItems.findOne({ where: { listID: listID } });
                if (!cards)
                    return res.status(404).json({ message: "Cards not found" });
                const { type } = req.body;
                const getCardsList = cards.cardsList ? JSON.parse(cards.cardsList) : [];
                const newCardsList = getCardsList.sort((a, b) => {
                    return type === "DESC" ? a.lastModified - b.lastModified : b.lastModified - a.lastModified;
                });
                cards.cardsList = JSON.stringify(newCardsList);
                yield cards.save();
                return res.status(200).json(cards);
            }
            catch (e) {
                res.status(400).json({ message: "Error: Can't sort cards" });
            }
        });
    }
    deleteCardList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const listId = req.params.id;
                const list = yield cards_1.Cards.findOne({ where: { id: listId } });
                if (!list)
                    return res.status(404).json({ message: "Card list not found" });
                yield list.destroy();
                return res.status(200).json(list);
            }
            catch (e) {
                res.status(400).json({ message: "Error: Can't delete card list" });
            }
        });
    }
    addCardToList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const listId = req.params.listID;
                const list = yield cards_1.Cards.findOne({ where: { id: listId } });
                if (!list)
                    return res.status(404).json({ message: "Card list not found" });
                const { title } = req.body;
                const cards = yield cardsItems_1.CardsItems.findOne({ where: { listID: listId } });
                const newCard = {
                    title: title,
                    lastModified: new Date().getTime()
                };
                if (!cards) {
                    const card = yield cardsItems_1.CardsItems.create({
                        cardsList: JSON.stringify([newCard]),
                        listID: Number(listId)
                    });
                }
                else {
                    const jsonCardsList = JSON.parse(cards.cardsList);
                    jsonCardsList.push(newCard);
                    cards.cardsList = JSON.stringify(jsonCardsList);
                    yield cards.save();
                }
                return res.status(200).json({ listID: Number(listId), card: newCard });
            }
            catch (e) {
                res.status(400).json({ message: "Error: Can't add card" });
            }
        });
    }
    updateCard(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { listID } = req.params;
                const list = yield cards_1.Cards.findOne({ where: { id: Number(listID) }, include: { model: cardsItems_1.CardsItems } });
                if (!list)
                    return res.status(404).json({ message: "Card list not found" });
                const { content, cardID } = req.body;
                const cards = yield cardsItems_1.CardsItems.findOne({ where: { listID } });
                if (!cards)
                    return res.status(404).json({ message: "Cards not found" });
                const updateCard = {
                    title: content,
                    lastModified: new Date().getTime()
                };
                const getCardsList = cards.cardsList ? JSON.parse(cards.cardsList) : [];
                const newCardsList = getCardsList.map((item, index) => {
                    if (index === Number(cardID)) {
                        return updateCard;
                    }
                    return item;
                });
                cards.cardsList = JSON.stringify(newCardsList);
                yield cards.save();
                return res.status(200).json({
                    listID: Number(listID),
                    cardID,
                    card: updateCard
                });
            }
            catch (e) {
                res.status(400).json({ message: "Error: Can't update card" });
            }
        });
    }
    updateCardOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { oldList, newList, currentItem } = req.body;
                const listOld = yield cards_1.Cards.findOne({ where: { id: oldList.id } });
                if (!listOld)
                    return res.status(404).json({ message: "Old Card list not found" });
                const listNew = yield cards_1.Cards.findOne({ where: { id: newList.id } });
                if (!listNew)
                    return res.status(404).json({ message: "New Card list not found" });
                const { cardsItems: cardsItemsOld } = oldList;
                const { cardsItems: cardsItemsNew } = newList;
                const cardsOld = yield cardsItems_1.CardsItems.findOne({ where: { listID: oldList.id } });
                if (cardsOld) {
                    const cardsListMap = cardsItemsOld.map((item) => {
                        return {
                            title: item.title,
                            lastModified: item.lastModified
                        };
                    });
                    cardsOld.cardsList = JSON.stringify(cardsListMap);
                    yield cardsOld.save();
                }
                const cardsNew = yield cardsItems_1.CardsItems.findOne({ where: { listID: newList.id } });
                const cardsListMapNew = cardsItemsNew.map((item, index) => {
                    if (index === currentItem.card) {
                        return {
                            title: item.title,
                            lastModified: new Date().getTime()
                        };
                    }
                    return {
                        title: item.title,
                        lastModified: item.lastModified
                    };
                });
                if (cardsNew) {
                    cardsNew.cardsList = JSON.stringify(cardsListMapNew);
                    yield cardsNew.save();
                }
                else {
                    const cardsCreated = yield cardsItems_1.CardsItems.create({
                        cardsList: JSON.stringify(cardsListMapNew),
                        listID: Number(newList.id)
                    });
                    return res.status(200).json({
                        oldList: cardsOld,
                        newList: cardsCreated
                    });
                }
                return res.status(200).json({
                    oldList: cardsOld,
                    newList: cardsNew
                });
            }
            catch (e) {
                res.status(400).json({ message: "Error: Can't update order cards" });
            }
        });
    }
    deleteCard(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { listID, cardID } = req.params;
                const list = yield cards_1.Cards.findOne({ where: { id: Number(listID) } });
                if (!list)
                    return res.status(404).json({ message: "Card list not found" });
                const cardsOld = yield cardsItems_1.CardsItems.findOne({ where: { listID: Number(listID) } });
                if (!cardsOld)
                    return res.status(404).json({ message: "Cards not found" });
                const getCardsList = cardsOld.cardsList ? JSON.parse(cardsOld.cardsList) : [];
                const newCardsList = getCardsList.filter((item, index) => index !== Number(cardID));
                cardsOld.cardsList = JSON.stringify(newCardsList);
                yield cardsOld.save();
                return res.status(200).json(cardsOld);
            }
            catch (e) {
                res.status(400).json({ message: "Error: Can't delete card list" });
            }
        });
    }
}
exports.default = new CardsController();
