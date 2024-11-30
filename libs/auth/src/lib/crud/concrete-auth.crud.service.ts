import { Injectable } from '@nestjs/common';
import { AbstractAuthCrudService } from './abstract-auth.crud.service';
import { EUser } from '@books4-muse/models';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class AuthCrudService extends AbstractAuthCrudService {
  constructor(
    @InjectRepository(EUser)
    private readonly userRepository: Repository<EUser>,
    override readonly dataSource: DataSource
  ) {
    super(userRepository, dataSource);
  }
}
