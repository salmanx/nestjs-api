import { Repository, EntityRepository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthDto, UserUpdateDto } from './dto/auth.dto';
import { User } from '../db/entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(authDto: AuthDto): Promise<User | void> {
    const { user_id, password, nickname, comment } = authDto;
    const user = new User();
    user.user_id = user_id;
    user.nickname = nickname || user_id;
    user.comment = comment;
    user.salt = await bcrypt.genSalt();
    user.password = await this.generateHashPassword(password, user.salt);

    try {
      const data = await user.save();
      return data;
    } catch (error) {
      if (error.code === '23505') {
        // 23505 is postgres error if uniq gets violation
        throw new ConflictException({
          error: 'already same user_id is used',
          message: 'Account creation failed'
        });
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findUserByUserID(user_id: string): Promise<User> {
    try {
      const user = await this.findOne({ user_id });
      return user;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async updateUser(userUpdateDto: UserUpdateDto, user): Promise<User> {
    const { nickname, comment } = userUpdateDto;

    try {
      user.nickname = nickname;
      user.comment = comment;
      const updatedUser = await user.save();
      return updatedUser;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  private async generateHashPassword(
    password: string,
    salt: string,
  ): Promise<string> {
    return await bcrypt.hash(password, salt);
  }
}
