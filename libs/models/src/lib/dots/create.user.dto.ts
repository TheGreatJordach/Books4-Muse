import { BaseUserDto } from './base.user.dto';
import { IsPasswordMatch } from '../decorators/validate.password';
import { IsStrongPassword } from 'class-validator';

export class CreateUserDto extends BaseUserDto {
  @IsStrongPassword()
  readonly password!: string;
  @IsPasswordMatch({ message: 'Passwords must match' })
  readonly confirmPassword!: string;
}
