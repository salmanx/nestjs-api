import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  Unique,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('users')
@Unique(['user_id'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  user_id: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column({
    nullable: true,
  })
  nickname: string;

  @Column({
    nullable: true,
  })
  comment: string;

  async validatePassword(password): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
