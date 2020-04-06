import { Resolver, Query, Mutation, Arg } from 'type-graphql'
import { Domain } from '../models/Domain'

@Resolver()
export class DomainResolver {
  @Query(() => [Domain])
  domains() {
    return Domain.find()
  }

  @Mutation()
  addDomain(@Arg('name') name: string): Domain {
    const domain = new Domain()
    domain.name = name
    domain.save()
    return domain
  }
}
