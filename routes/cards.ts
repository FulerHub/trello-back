import express from 'express';
import CardsController from "../controllers/CardsController";


const router = express.Router();
router.get('/', CardsController.getCards);
router.post('/list', CardsController.createCardList);
router.patch('/listOrder', CardsController.updateCardListOrder);
router.put('/list/:listID', CardsController.updateCardList);
router.put('/list/:listID/sort', CardsController.updateCardSort);
router.delete('/list/:id', CardsController.deleteCardList);

router.post('/card/:listID', CardsController.addCardToList);
router.patch('/cardOrder', CardsController.updateCardOrder);
router.put('/card/:listID', CardsController.updateCard);
router.delete('/card/:listID/:cardID', CardsController.deleteCard);

export default router;