import {
  AfterInsert,
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'
import { Path } from './Path'

@Entity()
@ObjectType()
export class Domain extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field(() => String)
  @Column()
  name: string

  @Field(() => Date)
  @CreateDateColumn()
  created: Date

  @OneToMany(() => Path, (path) => path.domain, {
    cascade: true,
  })
  paths: Path[]

  @AfterInsert()
  addPath() {
    const path = new Path()
    path.domain = this
    path.uri = '/'
    path.save()
  }
}
