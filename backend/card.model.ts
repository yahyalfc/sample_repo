import { HttpException } from '@/exceptions/HttpException';
import { CardInterface } from '@/interfaces/components/card.interface';
import { UserPlanInterface } from '@/interfaces/components/userPlan.interface';
import { WorkspaceInterface } from '@/interfaces/components/workspace.interface';
import workspaceModel from '@/migration/mig-models/mig-workspace.model';
import SendNowRecipient from '@/services/business-logic/sendNowRecipient';
import RecipientService from '@/services/recipient.service';
import WorkspaceService from '@/services/workspace.service';
import { Document, model, Schema } from 'mongoose';
import userPlanModel from './userPlan.model';
const _ = require('lodash');

const workspaceService = new WorkspaceService();
let preUpdatedDocument;
const cardSchema: Schema = new Schema(
  {
    hostName: String,
    // new properties upar wali
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'UserProfile',
    },
    stage: {
      width: Number,
      height: Number,
    },
    designUrl: String,
    deliveryDate: Number,
    deliveryInfo: {
      fromName: String,
      senderGroupName: String,
      recipients: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Recipients',
        },
      ],
      //recipients: [String],
      selectedEmailAccount: {
        createdAt: String,
        fromEmail: String,
        fromName: String,
        password: String,
        replyTo: String,
        smtpPort: String, //this should be a number
        smtphost: String,
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'UserProfile',
        },
        userName: String,
        workspaceId: {
          type: Schema.Types.ObjectId,
          ref: 'Workspace',
        },
      },
      reminderNextYear: Boolean,
    },
    isCopyRightDesign: Boolean,
    status: String,
    workspace_id: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
    },
    firebaseId: String,
    // workspace_id: String,
  },
  { versionKey: false, timestamps: true },
);

cardSchema.pre('save', async function (next) {
  const originalDocument = this.toJSON();
  const clonedDocument = _.cloneDeep(originalDocument);

  const workspace: WorkspaceInterface = await workspaceModel.findById(clonedDocument.workspace_id).lean();
  const workspaceOwner: UserPlanInterface = await userPlanModel.findById(workspace.owner_id).lean();
  //card_limit === 0 means that cards are you have used all your email accounts. so we will throw a exception.

  if (workspaceOwner.plan_data.card_limit === 0) {
    throw new HttpException(400, 'Your limit for cards is exceeded. Update your plan. ');
  }
  next();
});
// when a card is about to be updated check if its status is "sent". if it is then we will throw an error.

cardSchema.pre('updateOne', { document: false, query: true }, async function (next) {
  console.log('update card pre hook runnnnnoing');
  const clonedThis = _.cloneDeep(this);

  const updatedDoc = await clonedThis.model.findOne(clonedThis.getQuery());
  // globallly updated document which we will compare in post hook for deliveryInfo.
  //If deliveryInfo is same it means that limits shouldnt be updated again as the collaborater updated the card
  preUpdatedDocument = updatedDoc;

  const workspace: WorkspaceInterface = await workspaceModel.findById(updatedDoc.workspace_id).lean();
  const workspaceOwner: UserPlanInterface = await userPlanModel.findById(workspace.owner_id).lean();

  try {
    if (workspaceOwner.plan_data.email_limit === 0) {
      throw new HttpException(400, 'Your limit for card recipients is exceeded. Update your plan. ');
    }
    next();
  } catch (error) {
    throw new Error(error);
  }
});

cardSchema.post('updateOne', { document: false, query: true }, async function () {
  const clonedThis = _.cloneDeep(this);

  const updatedDoc = await clonedThis.model.findOne(clonedThis.getQuery()).lean();
  const sendNowRecipient = new SendNowRecipient();
  const workspace = await workspaceService.getWorkspaceById(updatedDoc.workspace_id);

  console.log({ one: updatedDoc.deliveryInfo });
  console.log({ two: preUpdatedDocument.deliveryInfo });

  try {
    const isEqual = _.isEqual(preUpdatedDocument.deliveryInfo, updatedDoc.deliveryInfo); // returns false if different
    console.log('is the updated card same', isEqual);

    if (!isEqual) {
      if (updatedDoc?.status === 'scheduled' && updatedDoc?.deliveryInfo?.recipients?.length) {
        // console.log('Send now email is now executing......');
        sendNowRecipient.sendNow(updatedDoc).then(res => {
          console.log('The Email have been sent successfully to the Recipients with sendNow true');
        });
        // subtracting card limit
        await userPlanModel.findByIdAndUpdate(workspace.owner_id, {
          $inc: { 'plan_data.card_limit': -1 }, //decremenet from card_limit
        });
        if (!updatedDoc.deliveryInfo?.selectedEmailAccount) {
          // here we will check if user has selectedEmailAccount. Means they're using their own email account. If they are we will not deduct recipients limit
          await userPlanModel.findByIdAndUpdate(workspace.owner_id, {
            $inc: { 'plan_data.email_limit': -updatedDoc?.deliveryInfo?.recipients?.length }, //decremenet from card_limit
          });
        }
      }
    }
  } catch (error) {
    throw new Error(error);
  }
});

const cardModel = model<CardInterface & Document>('Card', cardSchema, 'Card');

// on update what we want to do is that get length of recipients in deliveryInfo object and subtract that from email_limit.
// we will use watch method of mongoose for that.

export default cardModel;
