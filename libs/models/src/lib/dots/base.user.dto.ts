import { IUser } from '../business-types/users.interface';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';


export class BaseUserDto implements IUser {
  @IsNotEmpty()
  @IsString()
  readonly firstName!: string;
  @IsNotEmpty()
  @IsString()
  readonly lastName!: string;
  @IsBoolean()
  @IsOptional()
  readonly isActive?: boolean;
  @IsNotEmpty()
  @IsEmail()
  readonly email!: string;
}









