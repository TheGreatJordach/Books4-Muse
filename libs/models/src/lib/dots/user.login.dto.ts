import { CreateUserDto } from './create.user.dto';
import { OmitType } from '@nestjs/mapped-types';

export class LoginDto extends OmitType(CreateUserDto, ["firstName", "lastName","isActive","confirmPassword"]) {}
