import { CurrentUser } from '../decorators/currentUser.decorator';
import { AuthService } from './auth.service';
import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,  
  Res,
  HttpStatus,
  Get,
  Param,
  Patch,
  UsePipes,
} from '@nestjs/common';
import { Response } from 'express';
import { pick } from 'lodash';
import { AuthDto, UserUpdateDto } from './dto/auth.dto';
import { AuthGuard } from './auth.guard';
import { UserCreationValidationPipe } from '../pipes/validation.pipe';

@Controller('')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @UsePipes(UserCreationValidationPipe)
  async signUp(
    @Res() res: Response,
    @Body(ValidationPipe) authDto: AuthDto,
  ): Promise<any> {    
    const user = await this.authService.signUp(authDto);
    return res.status(HttpStatus.OK).send({
      message: 'Account successfully created',
      user: pick(user, ['user_id', 'nickname']),
    });
  }

  @Get('/users/:user_id')
  @UseGuards(AuthGuard)
  async getuser(
    @Res() res: Response,
    @Param('user_id') user_id: string,
  ): Promise<any> {
    const user = await this.authService.findUserByUserID(user_id);

    return res.status(HttpStatus.OK).send({
      message: `User details by user_id`,
      user: pick(user, ['user_id', 'nickname', 'comment']),
    });
  }

  @Patch('/users/:user_id')
  @UseGuards(AuthGuard)
  async updateuser(
    @Res() res: Response,    
    @Param('user_id') user_id: string,
    @Body(ValidationPipe) userUpdateDto: UserUpdateDto,
    @CurrentUser() currentUser,
  ): Promise<any> {
    const user = await this.authService.findUserByUserID(user_id);

    if (user_id !== currentUser.user_id) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .send({ message: 'No Permission for Update' });
    } else {
      const updateUser = await this.authService.updateUser(
        userUpdateDto,
        user,
      );
      return res.status(HttpStatus.OK).send({
        message: 'User successfully updated',
        user: pick(updateUser, ['nickname', 'comment']),
    });
      
    }
  }

  @Post('/close')
  @UseGuards(AuthGuard)  
  async deleteUser(
    @CurrentUser() currentUser,
    @Res() res: Response,
  ): Promise<any> {
    const result = await this.authService.deleteUser(currentUser);

    if (result === 1) {
      return res.status(HttpStatus.OK).send({
        message: 'Account and user successfully removed',
      });
    }
  }
}
