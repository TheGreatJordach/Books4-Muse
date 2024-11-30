import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordModule } from './password/password.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthCrudService } from './crud/concrete-auth.crud.service';
import { EUser } from '@books4-muse/models';



@Module({
  imports: [PasswordModule, TypeOrmModule.forFeature([EUser])],
  controllers: [AuthController],
  providers: [AuthService,AuthCrudService],
  exports: [AuthService],
})
export class AuthModule {}
