import { Injectable } from '@nestjs/common';
import { AbstractCrudService } from '@books4-muse/utils';
import { EUser, LoginDto } from '@books4-muse/models';

@Injectable()
export abstract class AbstractAuthCrudService extends AbstractCrudService<EUser>{
  // This class doesn't need a constructor since it's inherited from AbstractCrudService
  // Define abstract authentication-specific methods
 // abstract login(logInUser: LoginDto): Promise<EUser>;
 // abstract logout(logInUser: LoginDto): Promise<EUser>;
 // abstract validatePassword(user: EUser, password: string): Promise<boolean>;
}
