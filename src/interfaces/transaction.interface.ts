export interface TxnTableContent {
  key: React.Key;
  name: string;
  amount: string;
  address: string;
  teller: string;
}

export interface IContentItem {
  type: string;
  time: string;
  rambled: boolean;
  amount: number;
  number: string;
  schedule: string;
}

export interface IProfile {
  _id: string;
  user: string;
  firstName: string;
  lastName: string;
  birthdate: string;
  address: string;
  contactNumber: string;
  gender: string;
  refferedBy: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ITransaction {
  _id: string;
  user: string;
  content: IContentItem[];
  schedule: string;
  time: string;
  reference: string;
  game: string;
  createdAt: string;
  updatedAt: string;
  profile: IProfile;
}
