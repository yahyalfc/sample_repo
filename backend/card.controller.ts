import { HttpException } from '@/exceptions/HttpException';
import { CardInterface } from '@/interfaces/components/card.interface';
import { CardAndCardPagesInterface } from '@/interfaces/composite/cardAndCardPages.interface';
import CardService from '@/services/card.service';
import { isEmpty } from '@utils/util';
import { NextFunction, Request, Response } from 'express';

class CardController {
  public service = new CardService();

  public createCard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { card, cardPages } = req.body;
      if (isEmpty(card)) throw new HttpException(400, 'Internal error. Provide card data');
      if (isEmpty(cardPages)) throw new HttpException(400, 'Internal error. Provide card page data');
      const response: CardAndCardPagesInterface = await this.service.createCard(card, cardPages);
      res.status(201).json({ data: response, message: 'New card created successfully.' });
    } catch (error) {
      next(error);
    }
  };

  public updateCardStatusToSent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cardId = req.params.id;
      if (typeof cardId !== 'string') throw new HttpException(400, 'Provide card Id.');
      const updatedCard = await this.service.updateCardStatusToSent(cardId);
      res.status(200).json({ data: updatedCard, message: 'Updated status of card successfully.' });
    } catch (error) {
      next(error);
    }
  };

  public updateCard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cardId = req.params.id;
      const { card, cardPages } = req.body;

      if (typeof cardId !== 'string') throw new HttpException(400, 'Provide card id.');
      const updatedCard: CardAndCardPagesInterface = await this.service.updateCard(cardId, card, cardPages);
      res.status(200).json({ data: updatedCard, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public getSingleCard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cardId = req.params.id;
      if (isEmpty(cardId)) throw new HttpException(400, 'Provide card id.');
      const response: CardAndCardPagesInterface = await this.service.getSingleCard(cardId);
      res.status(200).json({ data: response, message: 'fetch successful' });
    } catch (error) {
      next(error);
    }
  };

  public deleteCard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { cardId, deleterId } = req.query;
      if (typeof cardId !== 'string') throw new HttpException(400, 'Invalid input while deleting card.');
      if (typeof deleterId !== 'string') throw new HttpException(400, 'Invalid input while deleting card.');
      await this.service.deleteCard(cardId, deleterId);
      res.status(200).json({ message: 'The card has been deleted.' });
    } catch (error) {
      next(error);
    }
  };

  public cloneCard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.query;
      const cardId = req.params.id;
      if (typeof cardId !== 'string') throw new HttpException(400, 'Card Id is not a string.');
      if (typeof userId !== 'string') throw new HttpException(400, 'User id is not a string.');
      const response: CardAndCardPagesInterface = await this.service.cloneCard(cardId, userId);
      res.status(201).json({ data: response, message: 'Card is cloned successfully.' });
    } catch (error) {
      next(error);
    }
  };

  public changeCover = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cardId = req.params.id;
      const coverUrl = req.query.coverUrl;
      if (isEmpty(cardId)) throw new HttpException(400, 'Provide card id.');
      if (isEmpty(coverUrl)) throw new HttpException(400, 'Provide cover url.');
      if (typeof coverUrl !== 'string') throw new HttpException(400, 'coverUrl should be a string.');
      const response: CardAndCardPagesInterface = await this.service.changeCover(cardId, coverUrl);
      res.status(200).json({ data: response, message: 'cover updated' });
    } catch (error) {
      next(error);
    }
  };

  public getAllCardsOfUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id;
      const workspaceId = req.params.workspaceId;
      if (isEmpty(userId)) throw new HttpException(400, 'Provide user id.');
      if (isEmpty(workspaceId)) throw new HttpException(400, 'Provide workspace id.');
      const response: CardInterface[] = await this.service.getAllCardsOfUser(userId, workspaceId);
      res.status(200).json({ data: response, message: 'returning all cards of user.' });
    } catch (error) {
      next(error);
    }
  };

  public getCardsByWorkspace = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workspaceId = req.params.id;
      if (isEmpty(workspaceId)) throw new HttpException(400, 'Provide workspace id.');
      const response: CardInterface[] = await this.service.getCardsByWorkspace(workspaceId);
      res.status(200).json({ data: response, message: 'all cards in our workspace' });
    } catch (error) {
      next(error);
    }
  };
}

export default CardController;
