import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@/middlewares/validation.middleware';
import CardController from '@/controllers/card.controller';
import firebaseTokenMiddleware from '@/middlewares/firebasetoken';
import { CreateCardDto } from '@/dtos/composite/createCardDto';

class CardRoute implements Routes {
  public path = '/card/';
  public router = Router();

  public cardController = new CardController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    //this.path  means url/
    this.router.post(`${this.path}`, firebaseTokenMiddleware, validationMiddleware(CreateCardDto, 'body', true), this.cardController.createCard); //!!VALIDATION BY DTO
    this.router.put(`${this.path}:id`, firebaseTokenMiddleware, validationMiddleware(CreateCardDto, 'body', true), this.cardController.updateCard); //!!VALIDATION BY DTO
    this.router.get(`${this.path}:id`, this.cardController.getSingleCard);
    this.router.delete(`${this.path}`, firebaseTokenMiddleware, this.cardController.deleteCard);
    // other functionality and services
    this.router.get(`${this.path}clone/:id`, firebaseTokenMiddleware, this.cardController.cloneCard);
    this.router.put(`${this.path}change-cover/:id`, firebaseTokenMiddleware, this.cardController.changeCover);
    this.router.get(`${this.path}user/:id/:workspaceId`, firebaseTokenMiddleware, this.cardController.getAllCardsOfUser);
    this.router.get(`${this.path}workspace/:id`, firebaseTokenMiddleware, this.cardController.getCardsByWorkspace);
    // change card status
    this.router.put(`${this.path}change-status/:id`, firebaseTokenMiddleware, this.cardController.updateCardStatusToSent);
  }
}

export default CardRoute;
