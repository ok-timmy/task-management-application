import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './users.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}
}
