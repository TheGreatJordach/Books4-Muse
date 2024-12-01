import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidPasswordDto } from './validate.password.dto';
import { validate } from 'class-validator';

export async function isValidPassword(password: string | Buffer): Promise<boolean> {
  let passwordToValidate :string

   if (password == null) {
    throw new HttpException(
      'Password must be provided and must be a string or Buffer',
      HttpStatus.BAD_REQUEST,
    );
  }

if(Buffer.isBuffer(password)){
  passwordToValidate = password.toString("utf-8");
} else if (typeof password === "string"){
  passwordToValidate = password
} else {
  throw new HttpException(
    "Password must be a string or Buffer",
    HttpStatus.BAD_REQUEST
  )
}

const passwordDto= new ValidPasswordDto(passwordToValidate)
const errors = await validate(passwordDto);

if (errors.length > 0) {
  throw new HttpException(
    'Password does not meet the required strength.',
    HttpStatus.BAD_REQUEST
  );
}

return true
}
