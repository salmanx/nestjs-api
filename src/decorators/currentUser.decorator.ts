import { createParamDecorator } from '@nestjs/common';
import { User } from '../db/entities/user.entity';

export const CurrentUser = createParamDecorator((data, req): User | any => {
  if (!req.user) return null;

  const { id, user_id, nickname } = req.user;

  return { id, user_id, nickname };
});
