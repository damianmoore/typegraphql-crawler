import { Resolver, Subscription, Root } from 'type-graphql'
import { Notification, NotificationPayload } from '../utils/Notification.type'

@Resolver()
export class StatusResolver {
  @Subscription({ topics: 'NOTIFICATIONS' })
  normalSubscription(
    @Root() { id, message }: NotificationPayload
  ): Notification {
    return { id, message, date: new Date() }
  }
}
