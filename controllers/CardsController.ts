import {NextFunction, Request, Response} from "express";
import {Cards} from "../models/cards";
import {CardsItems} from "../models/cardsItems";



class CardsController {
    public async getCards(req: Request, res: Response, next:NextFunction) {
        try{
            const cards = await Cards.findAll({
                include:{
                    model:CardsItems
                }
            });
            return res.status(200).json(cards);
        }catch (e) {
            res.status(400).json({message:"Error: Can't get cards",error: e});
        }
    }

    public async createCardList(req: Request, res: Response, next:NextFunction) {
        try{
            const {title} = req.body;
            const count = await Cards.count();
            const newCardList = await Cards.create({
                title:title,
                order:count+1
            });
            const cardList = await Cards.findOne({where:{id:newCardList.id},include:{
                    model:CardsItems
            }});
            return res.status(200).json(cardList);
        }catch (e) {
            res.status(400).json({message:"Error: Can't create card list"});
        }
    }

    public async updateCardListOrder(req: Request, res: Response, next:NextFunction) {
        try{
            const {list} = req.body;
            if(!list.length) return res.status(400).json({message:"Error: Can't update order list"});
            const cards = await Cards.findAll({
                include:{
                    model:CardsItems
                }
            });
            const listOrder:any = {};
            list.forEach((item:any)=>{
                listOrder[item.id] = item.order;
            });
            for (let card of cards) {
                card.order = listOrder[card.id] ? listOrder[card.id] : card.order;
                await card.save();
            }
           // await cards.save();

            return res.status(200).json(cards);
        }catch (e) {
            res.status(400).json({message:"Error: Can't update cards"});
        }
    }
    public async updateCardList(req: Request, res: Response, next:NextFunction) {
        try{
            const {listID} = req.params;
            const list = await Cards.findOne({ where: { id: listID },include:{model:CardsItems} });
            if (!list) return res.status(404).json({ message: "Card list not found" });
            const {title} = req.body;
            list.title = title;
            await list.save();
            return res.status(200).json(list);
        }catch (e) {
            res.status(400).json({message:"Error: Can't update card list"});
        }
    }

    public async updateCardSort(req: Request, res: Response, next:NextFunction) {
        try{
            const {listID} = req.params;
            const list = await Cards.findOne({ where: { id: listID },include:{model:CardsItems} });
            if (!list) return res.status(404).json({ message: "Card list not found" });
            const cards = await CardsItems.findOne({where:{listID:listID}});
            if (!cards) return res.status(404).json({ message: "Cards not found" });
            const {type} = req.body;

            const getCardsList = cards.cardsList ? JSON.parse(cards.cardsList) : [];
            const newCardsList = getCardsList.sort((a:any,b:any)=>{
                return type === "DESC" ?  a.lastModified - b.lastModified : b.lastModified - a.lastModified
            });

            cards.cardsList = JSON.stringify(newCardsList);
            await cards.save();
            return res.status(200).json(cards);
        }catch (e) {
            res.status(400).json({message:"Error: Can't sort cards"});
        }
    }

    public async deleteCardList(req: Request, res: Response, next:NextFunction) {
        try{
            const listId = req.params.id;
            const list = await Cards.findOne({ where: { id: listId } });
            if (!list) return res.status(404).json({ message: "Card list not found" });
            await list.destroy();
            return res.status(200).json(list);
        }catch (e) {
            res.status(400).json({message:"Error: Can't delete card list"});
        }
    }

    public async addCardToList(req: Request, res: Response, next:NextFunction) {
        try{
            const listId = req.params.listID;
            const list = await Cards.findOne({ where: { id: listId } });
            if (!list) return res.status(404).json({ message: "Card list not found" });
            const {title} = req.body;
            const cards = await CardsItems.findOne({where:{listID:listId}});
            const newCard = {
                title: title,
                lastModified: new Date().getTime()
            };
            if (!cards) {
                const card = await CardsItems.create({
                    cardsList:JSON.stringify([newCard]),
                    listID: Number(listId)
                });

            }
            else{
                const jsonCardsList = JSON.parse(cards.cardsList);
                jsonCardsList.push(newCard);
                cards.cardsList = JSON.stringify(jsonCardsList);
                await cards.save();
            }
            return res.status(200).json({listID:Number(listId),card:newCard});
        }catch (e) {
            res.status(400).json({message:"Error: Can't add card"});
        }
    }

    public async updateCard(req: Request, res: Response, next:NextFunction) {
        try{
            const {listID} = req.params;
            const list = await Cards.findOne({ where: { id: Number(listID) },include:{model:CardsItems} });
            if (!list) return res.status(404).json({ message: "Card list not found" });
            const {content,cardID} = req.body;
            const cards = await CardsItems.findOne({where:{listID}});
            if (!cards) return res.status(404).json({ message: "Cards not found" });
            const updateCard = {
                title: content,
                lastModified: new Date().getTime()
            };

            const getCardsList = cards.cardsList ? JSON.parse(cards.cardsList) : [];
            const newCardsList = getCardsList.map((item:any,index:number)=>{
                if(index === Number(cardID)){
                    return updateCard
                }
                return item;
            });
            cards.cardsList = JSON.stringify(newCardsList);
            await cards.save();

            return res.status(200).json({
                listID:Number(listID),
                cardID,
                card: updateCard
            });
        }catch (e) {
            res.status(400).json({message:"Error: Can't update card"});
        }
    }
    public async updateCardOrder(req: Request, res: Response, next:NextFunction) {
        try{
            const {oldList,newList,currentItem} = req.body;
            const listOld = await Cards.findOne({ where: { id: oldList.id } });
            if (!listOld) return res.status(404).json({ message: "Old Card list not found" });
            const listNew = await Cards.findOne({ where: { id: newList.id } });
            if (!listNew) return res.status(404).json({ message: "New Card list not found" });

            const {cardsItems:cardsItemsOld} = oldList;
            const {cardsItems:cardsItemsNew} = newList;
            const cardsOld = await CardsItems.findOne({where:{listID:oldList.id}});
            if(cardsOld){
                const cardsListMap = cardsItemsOld.map((item:any)=>{
                    return {
                        title:item.title,
                        lastModified:item.lastModified
                    }
                });
                cardsOld.cardsList = JSON.stringify(cardsListMap);
                await cardsOld.save();
            }
            const cardsNew = await CardsItems.findOne({where:{listID:newList.id}});
            const cardsListMapNew = cardsItemsNew.map((item:any,index:number)=>{
                if(index === currentItem.card){
                    return {
                        title:item.title,
                        lastModified:new Date().getTime()
                    }
                }
                return {
                    title:item.title,
                    lastModified:item.lastModified
                }
            });
            if(cardsNew){
                cardsNew.cardsList = JSON.stringify(cardsListMapNew);
                await cardsNew.save();
            }else {
                const cardsCreated = await CardsItems.create({
                    cardsList:JSON.stringify(cardsListMapNew),
                    listID: Number(newList.id)
                })
                return res.status(200).json({
                    oldList:cardsOld,
                    newList:cardsCreated
                });
            }


            return res.status(200).json({
                oldList:cardsOld,
                newList:cardsNew
            });
        }catch (e) {
            res.status(400).json({message:"Error: Can't update order cards"});
        }
    }
    public async deleteCard(req: Request, res: Response, next:NextFunction) {
        try{
            const {listID,cardID} = req.params;
            const list = await Cards.findOne({ where: { id: Number(listID) } });
            if (!list) return res.status(404).json({ message: "Card list not found" });
            const cardsOld = await CardsItems.findOne({where:{listID:Number(listID)}});
            if (!cardsOld) return res.status(404).json({ message: "Cards not found" });

            const getCardsList = cardsOld.cardsList ? JSON.parse(cardsOld.cardsList) : [];
            const newCardsList = getCardsList.filter((item:any,index:number)=>index !== Number(cardID));
            cardsOld.cardsList = JSON.stringify(newCardsList);
            await cardsOld.save();

            return res.status(200).json(cardsOld);
        }catch (e) {
            res.status(400).json({message:"Error: Can't delete card list"});
        }
    }
}

export default new CardsController();