import { EmailAccountInterface } from './emailAccount.interface';

interface Dimensions {
  width: number;
  height: number;
}

interface Delivery {
  selectedEmailAccount: EmailAccountInterface;
  recipients: string[]; //
  fromName: string;
  email: string;
  name: string;
  reminderNextYear: boolean;
  senderGroupName: string;
  designUrl: string;
}

export interface CardInterface {
  _id: string;
  owner: string;
  stage: Dimensions; //object
  designUrl: string;
  deliveryDate: number;
  deliveryInfo: Delivery; // object
  isCopyrightDesign: boolean;
  status: string;
  workspace_id: string;
  hostName: string;
  error?: string;
  createdAt?: string;
  updatedAt?: string;
}
