import { AuthDto, UserUpdateDto } from './dto/auth.dto';
import { UserRepository } from './user.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../db/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async signUp(authDto: AuthDto): Promise<User | void> {
    return await this.userRepository.createUser(authDto);
  }

  async findUserByUserID(user_id: string): Promise<User> {
    return await this.userRepository.findUserByUserID(user_id);
  }

  async updateUser(userUpdateDto: UserUpdateDto, user): Promise<User> {
    return await this.userRepository.updateUser(userUpdateDto, user);
  }

  async deleteUser(user): Promise<any> {
    const result = await this.userRepository.delete(user.id);

    if (result.affected === 0) {
      throw new BadRequestException({
        message: `The user with id ${user.user_id} not found`,
      });
    }

    return result.affected;
  }
}
