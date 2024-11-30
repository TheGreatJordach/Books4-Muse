import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PasswordService } from './password/password.service';
import { AuthCrudService } from './crud/concrete-auth.crud.service';
import { CreateUserDto, EUser } from '@books4-muse/models';


@Injectable()
export class AuthService {
  constructor(
     private readonly passwordService: PasswordService,
     private readonly authCrudService: AuthCrudService,) {}

  async signUP(createUser: CreateUserDto): Promise<EUser> {
    const userExist : EUser | null = await this.authCrudService.findOneByEmail(createUser.email);

    if (!userExist) {
      throw new HttpException('User already exists', HttpStatus.NOT_FOUND);
    }

    const [error, hashedPassword] = await this.passwordService.hashPassword(createUser.password);

    if (!hashedPassword || error) {
      throw new HttpException('' +
        'Something bad happen. Failed to store credential',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    const newUser : EUser = await this.authCrudService.create({...createUser,password:hashedPassword})

    if(!newUser) {
      throw new HttpException('' +
        'Something bad happen. Failed to save new user',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return newUser
  }
}
