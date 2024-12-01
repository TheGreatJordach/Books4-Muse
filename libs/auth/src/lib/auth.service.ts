import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PasswordService } from './password/password.service';
import { AuthCrudService } from './crud/concrete-auth.crud.service';
import { CreateUserDto, EUser, LoginDto, MiniUserDto } from '@books4-muse/models';
import jwtConfig from './jwt/jwt.config';
import { ConfigType } from '@nestjs/config';
import { HandleErrors } from '@books4-muse/utils';
import { JwtService } from '@nestjs/jwt';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly passwordService: PasswordService,
    private readonly authCrudService: AuthCrudService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
  ) {}

  async signUP(createUser: CreateUserDto): Promise<string> {
    const userExist: EUser | null = await this.authCrudService.findOneByEmail(
      createUser.email
    );

    if (userExist) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const [error, hashedPassword] = await this.passwordService.hashPassword(
      createUser.password
    );

    this.checkErrors(error, hashedPassword);

    const newUser: EUser = await this.authCrudService.create({
      ...createUser,
      password: hashedPassword,
    });

    if (!newUser) {
      throw new HttpException(
        '' + 'Failed to save new user',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    this.logger.log('User successfully created');

    return await this.getAccessToken(newUser).catch((error) => {
      this.logger.error(
        `Failed to create credential for authentication ${JSON.stringify(
          error
        )}`
      );
      throw new HttpException(
        'Failed to generate access token',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    });
  }

  async signIn(loginDto: LoginDto): Promise<[MiniUserDto, string]> {

    const existingUser: EUser | null = await this.authCrudService.findOneByEmail(loginDto.email)

    if(!existingUser) {
      this.logger.error("No user associated with this account Found");
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    const isMach: boolean = await this.passwordService
      .comparePassword(loginDto.password,existingUser.password)
      .catch((error) => {
      this.logger.error(`Error verifying credentials: ${error.message}`);
      throw new HttpException("Failed to verify user credentials", HttpStatus.INTERNAL_SERVER_ERROR);
    });

    if(!isMach){
      this.logger.error(`Invalid email or password provided`);
      throw new HttpException("Invalid credentials", HttpStatus.UNAUTHORIZED);
    }

    const accessToken: string = await this.getAccessToken(existingUser).catch((error) => {
      this.logger.error(
        `Error generating access token: ${error.message}`
      )

      throw new HttpException(
        'Failed to generate access token',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    });

    const payload = {
      sub: existingUser.id,
      email: existingUser.email,
      scope: existingUser.getAuthScope(),
      isActive: existingUser.isActive,
    }

    const  miniUser: MiniUserDto = await this.plainToDto(MiniUserDto,payload)

    return [miniUser, accessToken]


  }

 private checkErrors(error: any, data: any) {
    if (!data) {
      this.logger.error('No data returned after operation');
      throw new HttpException(
        '' + 'Errors occurred while processing the request ',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    if (error) {
      this.logger.error(
        `Error during operation: ${error.message}`,
        error.stack
      );
      throw new HttpException(
        '' + 'Errors happened during the operations',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @HandleErrors(true)
  private async  getAccessToken(user: EUser) {
    return await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        status: user.isActive,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.accessTokenTtl,
      }
    );
  }


  private async plainToDto<T extends object>(dto: ClassConstructor<T>,payload: object) {
    const validated = plainToInstance(dto, payload);

    const errors = await validate(validated,{
      skipMissingProperties:false,
    });

    if (errors.length > 0) {
      console.error('Validation failed:', errors);
      throw new Error('Invalid payload');
    }

    return validated
  }

}



