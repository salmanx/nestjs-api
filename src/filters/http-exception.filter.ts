import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { keys, values } from 'lodash';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = exception.getStatus();

    let error;
    let message;

  
    if (keys(request.body).length === 0 && request.method === 'POST') {
      error = 'required user_id and password';
      message = 'Account creation failed';
    } else if (status === 409) {
      status = 400;
      error = 'already same user_id is used';
      message = 'Account creation failed';
    } else if (request.method === 'PATCH') {
      (message = 'Authentication Faild'),
        (error = 'required nickname or comment');
    } else {
      error = values(exception.message.message[0].constraints)[0];
    }

    response.status(status).json({
      message: message,
      cause: error,
    });
  }
}
