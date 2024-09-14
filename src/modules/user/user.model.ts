import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { ENTITY_STATUS } from '@common/constants';
import { Timestamps } from '@common/models/timestamps.model';

export interface PublicUser {
  id: string;
  phoneNumber: string;
  email: string;
  code: string;
}

export const extractPublicUserInfo = (user: User): PublicUser => {
  if (!user) return null;

  const { id, phoneNumber, email, code } = user;
  return {
    id,
    phoneNumber,
    email,
    code,
  };
};

@Entity({ name: 'user' })
export class User extends Timestamps {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    type: String,
    unique: true,
    nullable: true,
  })
  public email: string;

  @Column({
    type: String,
    name: 'phoneNumber',
    unique: true,
    nullable: true,
  })
  public phoneNumber: string;

  @Column({
    type: String,
    nullable: false,
  })
  public password: string;

  @Column({
    type: 'enum',
    nullable: false,
    enum: ENTITY_STATUS,
    default: ENTITY_STATUS.ACTIVE,
  })
  public status: ENTITY_STATUS;

  @Column({
    type: Boolean,
    nullable: true,
  })
  public isVerified: boolean;

  @Column({
    type: String,
    nullable: true,
  })
  public token: string;

  @Column({
    type: String,
    unique: true,
    nullable: true,
  })
  public code: string;
}
