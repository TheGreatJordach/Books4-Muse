import { Module } from '@nestjs/common';
import { PasswordService } from './password.service';
import { BcryptImplProvider } from './hash/bcrypt.impl.provider';
import { ConfigModule } from '@nestjs/config';



@Module({
  imports: [ConfigModule],
  providers: [PasswordService, BcryptImplProvider],
  exports: [PasswordService]
})
export class PasswordModule {}
