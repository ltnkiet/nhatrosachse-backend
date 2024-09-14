import { CreateDateColumn, DeleteDateColumn, Index, UpdateDateColumn } from 'typeorm';

export class Timestamps {
  @CreateDateColumn()
  @Index()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({
    select: false,
  })
  deletedAt: Date;
}
