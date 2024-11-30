import { IsStrongPassword } from 'class-validator';

/**
 * DTO for password validation.
 */
export class ValidPasswordDto {
  @IsStrongPassword()
  readonly password: string;

  constructor(password: string) {
    this.password = password;
  }
}
