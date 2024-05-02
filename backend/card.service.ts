import { HttpException } from '@exceptions/HttpException';
import cardModel from '@/models/card.model';
import { CardDto } from '@/dtos/components/card.dto';
import { CardInterface } from '@/interfaces/components/card.interface';
import workspaceModel from '@/models/workspace.model';
import { WorkspaceInterface } from '@/interfaces/components/workspace.interface';
import { UserProfileInterface } from '@/interfaces/components/userProfile.interface';

import { CardPageInterface } from '@/interfaces/components/cardPage.interface';
import cardPageModel from '@/models/cardPage.model';
import { CardPageDto } from '@/dtos/components/cardPage.dto';
import { CardAndCardPagesInterface } from '@/interfaces/composite/cardAndCardPages.interface';
import userProfileModel from '@/models/userProfile.model';
// import { Mongoose } from 'mongoose';
const mongoose = require('mongoose');

class CardService {
  public card = cardModel;
  public workspace = workspaceModel;
  public cardPage = cardPageModel;
  public user = userProfileModel;
  /**
   *
   * @param card card data
   * @param cardPagesData data of cardpages
   * @returns card
   */
  public async createCard(card: CardDto, cardPagesData: CardPageDto): Promise<CardAndCardPagesInterface> {
    const createdCard: CardInterface = await this.card.create({ ...card });
    const { cardPages }: CardPageInterface = await this.cardPage.create({ _id: createdCard._id, cardPages: cardPagesData });
    //pushing the card into user's workspace
    await this.workspace.updateOne({ _id: card.workspace_id }, { $push: { cards: createdCard._id } });
    // return createdCard;
    return { ...card, _id: createdCard._id, cardPages };
  }

  /**
   *
   * @param cardId id of card we want to update
   * @param cardData data that we are updating
   * @returns card
   */
  public async updateCard(cardId: string, cardData: any, cardPageData: any): Promise<CardAndCardPagesInterface> {
    // get card by cardId and check its status. If its delivered then return k this card is updated;
    const currentCard = await this.card.findOne({ _id: cardId });
    if (currentCard.status === 'delivered') throw new HttpException(400, 'This card is already delivered');

    const entries = Object.keys(cardData);
    const updates = {};
    //dynamically updating only those values which are sent in the request. cuz patch only changes the values sent in request
    entries.forEach((entry, index) => (updates[entries[index]] = Object.values(cardData)[index]));
    await this.card.updateOne({ _id: cardId }, { $set: updates });
    const card: CardInterface = await this.card.findOne({ _id: cardId }).lean();

    await this.cardPage.updateOne({ _id: cardId }, { $set: { cardPages: cardPageData } });
    const { cardPages } = await this.cardPage.findOne({ _id: cardId }).lean();

    return { ...card, cardPages };
  }

  public async updateCardStatusToSent(cardId: string): Promise<CardInterface> {
    /**  get card by cardId and check its status. If its delivered then return k this card is updated*/
    try {
      const currentCard = await this.card.findById(cardId);
      if (currentCard.status === 'sent') throw new HttpException(400, 'This card is already delivered');
      await this.card.updateOne({ _id: cardId }, { $set: { status: 'sent' } });
      const card: CardInterface = await this.card.findOne({ _id: cardId });
      return card;
    } catch (err) {
      console.log('err', err);
      throw new HttpException(400, 'Error occurred while processing card status.');
    }
  }

  /**
   *
   * @param id cardId
   * @returns card
   */
  public async getSingleCard(cardId: string): Promise<CardAndCardPagesInterface> {
    const card: CardInterface = await this.card.findById(cardId).lean();
    if (!card) throw new HttpException(409, 'This card does not exist');
    const { cardPages } = await this.cardPage.findById(cardId).lean();

    return { ...card, cardPages };
  }
  /**
   *
   * @param cardId id of card we want to delete
   * @returns null
   */
  public async deleteCard(cardId, deleterId): Promise<void> {
    const deletedCard: CardInterface = await this.card.findById(cardId).lean();
    if (!deletedCard) throw new HttpException(409, "This card doesn't exist.");
    // team member cant delete a card.
    const workspace: WorkspaceInterface = await this.workspace.findById(deletedCard.workspace_id);
    const deleter: UserProfileInterface = await this.user.findById(deleterId);

    const deleterObj = workspace.member.find(mem => mem.email === deleter.email);
    if (deleterObj?.role === 'teamMember') throw new HttpException(400, 'Team member cant delete a card.');

    try {
      const data = this.card.findById({ _id: cardId }, async (err: Error, doc: any) => {
        await doc.remove();
      });
    } catch (err) {
      throw new HttpException(err.code, err.message);
    }

    const deletedCardPage: CardPageInterface = await this.cardPage.findByIdAndDelete(cardId);
    // if (!deletedCardPage) throw new HttpException(409, "This card page doesn't exist.");
    //!! pop from array in workspaces
    //now remove this card from the workspace.
    const workspaceId = deletedCard.workspace_id;
    const cards = workspace.cards;
    const updatedCards = cards.filter(card => card.toString() !== cardId);

    // now we set it back to our workspace.
    await this.workspace.updateOne({ _id: workspaceId }, { $set: { cards: updatedCards } });
  }
  /**
   *
   * @param cardId card that we want to clone.
   * @returns card
   */
  public async cloneCard(cardId: string, userId: string): Promise<CardAndCardPagesInterface> {
    const card: CardInterface = await this.card.findById(cardId).lean();
    const cardPage: CardPageInterface = await this.cardPage.findById(cardId).lean();

    const { _id, ...data } = card;
    const { _id: pageId, ...pagedata } = cardPage;
    const clone: CardInterface = await this.card.create({
      ...data,
      deliveryInfo: null,
      status: 'draft',
      deliveryDate: null,
      owner: mongoose.Types.ObjectId(userId),
    });
    const { cardPages }: CardPageInterface = await this.cardPage.create({ _id: clone._id, ...pagedata });

    const newClone = await this.card.findById(clone._id).lean();

    return { ...newClone, cardPages };
  }
  /**
   *
   * @param cardId id of card
   * @param coverUrl updated url of cover
   * @returns card
   */
  public async changeCover(cardId: string, coverUrl: string): Promise<CardAndCardPagesInterface> {
    const currentCard: CardInterface = await this.card.findOne({ _id: cardId });
    if (currentCard.status === 'delivered') throw new HttpException(400, 'This card is already delivered');

    await this.card.updateOne({ _id: cardId }, { designUrl: coverUrl }).lean();
    await this.cardPage.updateOne({ _id: cardId }, { $set: { 'cardPages.0.images.0.imageUrl': coverUrl } });

    const card = await this.card.findById(cardId).lean();
    const { cardPages } = await this.cardPage.findById(cardId).lean();

    return { ...card, cardPages };
  }
  /**
   *
   * @param userId
   * @returns cards[]
   */
  public async getAllCardsOfUser(userId: string, workspaceId: string): Promise<CardInterface[]> {
    const findCards: CardInterface[] = await this.card.find({ owner: userId, workspace_id: workspaceId }).sort({ updatedAt: 'desc' }).exec();
    return findCards;
  }
  /**
   *
   * @param workspaceId
   * @returns cards[]
   */
  public async getCardsByWorkspace(workspaceId: string): Promise<CardInterface[]> {
    const findCards: CardInterface[] = await this.card.find({ workspace_id: workspaceId }).sort({ updatedAt: 'desc' }).exec();
    return findCards;
  }

  public async updateCardStatus(cardId: string, payload: any): Promise<any> {
    /**  get card by cardId and check its status. If its delivered then return k this card is updated*/
    const currentCard = await this.card.findById(cardId);
    if (currentCard.status === 'sent') throw new HttpException(400, 'This card is already delivered');
    await this.card.updateOne({ _id: cardId }, { $set: { status: payload.status, updatedAt: payload.updatedAt } });
    // const card = await this.card.findOne({ _id: cardId });
    return 'Success';
  }
}

export default CardService;
