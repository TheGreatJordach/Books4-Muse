import { IsBoolean, IsEmail, IsEnum, IsInt, IsPositive } from 'class-validator';
import { AuthScope } from '../business-types/auth.scrop.enum';

export class MiniUserDto{
  @IsInt()
  @IsPositive()
  sub!:number
  @IsEmail()
  email!:string
  @IsEnum(AuthScope)
  scope!: AuthScope
  @IsBoolean()
  isActive!: boolean
}
