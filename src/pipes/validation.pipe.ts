import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { keys} from 'lodash';

export class UserCreationValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // const restrictedUser = startsWith(value.user_id, 'Test');
    // if (restrictedUser) {
    //   throw new BadRequestException({
    //     message: 'Account creation failed',
    //     cause: `${value.user_id} is reserverd for test user`,
    //   });
    // }

    // Custom pipe to customise error message

    if (!(keys(value).includes("user_id") &&  keys(value).includes("password"))) {
      throw new BadRequestException({
        error: 'required user_id and password',
        message: 'Account creation failed'
      });      
    }
    
    return value;
  }
}

