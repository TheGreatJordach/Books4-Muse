import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordModule } from './password/password.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthCrudService } from './crud/concrete-auth.crud.service';
import { EUser } from '@books4-muse/models';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './jwt/jwt.config';
import { CookieService } from './cookies/cookie.service';



@Module({
  imports: [
    PasswordModule,
    TypeOrmModule.forFeature([EUser]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  controllers: [AuthController],
  providers: [AuthService,AuthCrudService,CookieService],
  exports: [AuthService,CookieService],
})
export class AuthModule {}
