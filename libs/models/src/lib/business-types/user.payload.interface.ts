import { AuthScope } from './auth.scrop.enum';

export interface IUserPayload {
  email: string;
  isActive: boolean;
  sub:number
  token: string;
  authScope: AuthScope;
}
