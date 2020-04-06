import {
  AfterInsert,
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'
import { ObjectType, Field, ID, PubSub } from 'type-graphql'
import { PubSubEngine } from 'graphql-subscriptions'
import { Domain } from './Domain'
import { fetchMe } from '../utils/fetchMe'
import { Notification, NotificationPayload } from '../utils/Notification.type'

@Entity()
@Unique(['uri', 'domain'])
@ObjectType()
export class Path extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Domain, (domain) => domain.paths, {
    onDelete: 'CASCADE',
  })
  domain: Domain

  @Field(() => String)
  @Column()
  uri: string

  @Field(() => Date)
  @CreateDateColumn()
  created: Date

  @Field(() => Boolean)
  @Column({ default: false })
  visited: Boolean

  @Field(() => Boolean)
  @Column({ default: false })
  valid: Boolean

  @AfterInsert()
  async fetchPage(@PubSub() pubSub: PubSubEngine) {
    const url = 'http://' + this.domain.name + this.uri

    // TODO: Figure out how to send pubsub notification from this point
    // const payload: NotificationPayload = { id: 1, message: url }
    // await pubSub.publish('NOTIFICATIONS', payload)

    const body = await fetchMe(url)

    this.visited = true
    if (body) {
      this.valid = true
    }
    this.save()

    const regexHref = /href=\"(\S+)\"/g
    let match
    let submatch

    // Loop over all href values in the page
    while ((match = regexHref.exec(body)) !== null) {
      submatch = match[1]
      let newUri = null

      // Check href value goes to same domain and extract just the URI
      if (/^\/\S/.exec(submatch)) {
        // Internal to same domain
        newUri = submatch
      } else if (
        /^https?:\/\/([a-zA-Z0-9-.]+)\//.exec(submatch) &&
        /^https?:\/\/([a-zA-Z0-9-.]+)\//.exec(submatch)[1] == this.domain.name
      ) {
        // Full URL with matching domain name
        newUri = /^https?:\/\/([a-zA-Z0-9-.]+)(\/\S+)/.exec(submatch)[2]
      }

      // If checks pass, add new path to DB. Unique integrity contrains will prevent us adding duplicates
      if (newUri) {
        const path = new Path()
        path.domain = this.domain
        path.uri = submatch
        try {
          await path.save()
        } catch {}
      }
    }
  }
}
