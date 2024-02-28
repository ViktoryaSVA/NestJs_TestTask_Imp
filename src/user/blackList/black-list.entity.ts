import {
  BeforeInsert,
  Column,
  Entity, JoinTable, ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { hash } from 'bcrypt';

@Entity({ name: 'black-list' })
export class BlackListEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;
}
