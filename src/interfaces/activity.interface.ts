import { IUser } from './client.interface';
import { IProfile } from './transaction.interface';

export interface IActivity {
  _id: string;
  user: IUser;
  description: string;
  createdAt: string;
  updatedAt: string;
  profile: IProfile;
}
