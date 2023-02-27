"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CardsController_1 = __importDefault(require("../controllers/CardsController"));
const router = express_1.default.Router();
router.get('/', CardsController_1.default.getCards);
router.post('/list', CardsController_1.default.createCardList);
router.patch('/listOrder', CardsController_1.default.updateCardListOrder);
router.put('/list/:listID', CardsController_1.default.updateCardList);
router.put('/list/:listID/sort', CardsController_1.default.updateCardSort);
router.delete('/list/:id', CardsController_1.default.deleteCardList);
router.post('/card/:listID', CardsController_1.default.addCardToList);
router.patch('/cardOrder', CardsController_1.default.updateCardOrder);
router.put('/card/:listID', CardsController_1.default.updateCard);
router.delete('/card/:listID/:cardID', CardsController_1.default.deleteCard);
exports.default = router;
