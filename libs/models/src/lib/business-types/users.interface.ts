import { AuthScope } from './auth.scrop.enum';


export interface IUser {
  id?: number;
  firstName: string;
  lastName: string;
  password?: string;
  confirmPassword?: string;
  email: string;
  isActive?: boolean;
  authScope?: AuthScope
}



