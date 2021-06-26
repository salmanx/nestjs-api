import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import {startsWith} from "lodash";

export class UserIDValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    
    const restrictedUser  = startsWith(value.user_id, "Test")
    console.log('resttrictedUser', restrictedUser);

    if(restrictedUser) {
      throw new BadRequestException({
        message: "Account creation failed",
        cause: `${value.user_id} is reserverd for test user`
      });
    }
    

    // return value;
  }
}
