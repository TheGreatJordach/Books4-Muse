import { AbstractPasswordService } from './abstract.password.service';
import { Injectable } from '@nestjs/common';
import { BcryptImplProvider } from './hash/bcrypt.impl.provider';

@Injectable()
export class PasswordService extends AbstractPasswordService {
  constructor(bcryptProvider: BcryptImplProvider) {
    super(bcryptProvider);
  }

  /**
   * Extends the functionality of AbstractPasswordService for specific implementations
   * or additional methods in the future.
   */
}
