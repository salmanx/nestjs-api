import { CurrentUser } from './currentUser.decorator';
import { AuthService } from './auth.service';
import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Req,
  Res,
  HttpStatus,
  UseFilters,
  Get,
  Param,
  Patch,
  UsePipes,
  // UseInterceptors,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { pick, has } from 'lodash';
import { AuthDto, UserUpdateDto } from './dto/auth.dto';
import { AuthGuard } from './auth.guard';
import { HttpExceptionFilter } from '../filters/http-exception.filter';
import { UserIDValidationPipe } from './Validation.pipe';

@Controller('')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  // @UsePipes(UpdateValidationPipe)
  @UseFilters(new HttpExceptionFilter())
  async signUp(
    @Body(ValidationPipe) authDto: AuthDto,
    @Res() res: Response,
  ): Promise<any> {
    const user = await this.authService.signUp(authDto);
    if (user) {
      return res.status(HttpStatus.OK).send({
        message: 'Account successfully created',
        user: pick(user, ['user_id', 'nickname']),
      });
    } else {
      return res.status(HttpStatus.BAD_REQUEST).send('error');
    }
  }

  @Get('/users/:user_id/')
  @UseGuards(AuthGuard)
  async getuser(
    @Param('user_id') user_id: string,
    @Res() res: Response,
    @CurrentUser() currentUser,
  ): Promise<any> {
    const user = await this.authService.findUserByUserID(user_id);
    if (user && user.user_id) {
      return res.status(HttpStatus.OK).send({
        message: `User details by ${user_id}`,
        user: pick(user, ['user_id', 'nickname', 'comment']),
      });
    } else {
      return res
        .status(HttpStatus.NOT_FOUND)
        .send({ message: 'No User found' });
    }
  }

  @Patch('/users/:user_id/')
  @UseGuards(AuthGuard)
  @UseFilters(new HttpExceptionFilter())
  // @UsePipes(UpdateValidationPipe)
  async updateuser(
    @Param('user_id') user_id: string,
    @Body(ValidationPipe) userUpdateDto: UserUpdateDto,
    @Res() res: Response,
    @Req() req: Request,
    @CurrentUser() currentUser,
  ): Promise<any> {
    const user = await this.authService.findUserByUserID(user_id);
    if (user && user.user_id) {
      if (user.user_id !== currentUser.user_id) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send({ message: 'No Permission for Update' });
      } else {
        if (has(req.body, ['user_id']) || has(req.body, ['password'])) {
          return res.status(HttpStatus.OK).send({
            message: 'User updation failed',
            cause: 'not updatable user_id and password',
          });
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
    } else {
      return res
        .status(HttpStatus.NOT_FOUND)
        .send({ message: 'No User found' });
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
