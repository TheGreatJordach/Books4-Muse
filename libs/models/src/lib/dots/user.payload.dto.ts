import { IsBoolean, IsEmail, IsEnum, IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { AuthScope } from '../business-types/auth.scrop.enum';
import { IUserPayload } from '../business-types/user.payload.interface';

export class UserPayloadDto implements IUserPayload {
  @IsNotEmpty()
  @IsEmail()
  readonly email!: string;
  @IsNotEmpty()
  @IsBoolean()
  readonly isActive!: boolean;
  @IsNotEmpty()
  @IsPositive()
  @IsInt()
  sub!:number
  @IsNotEmpty()
  @IsString()
  token!: string;
  @IsNotEmpty()
  @IsEnum(AuthScope)
  authScope!: AuthScope;
}
