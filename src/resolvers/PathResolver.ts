import { Arg, Resolver, Query } from 'type-graphql'
import { Domain } from '../models/Domain'
import { Path } from '../models/Path'

@Resolver()
export class PathResolver {
  @Query(() => [Path])
  async getPaths(@Arg('name') name: string) {
    const domains = await Domain.find({
      where: {
        name: name,
      },
      order: {
        created: 'DESC',
      },
      take: 1,
    })
    return Path.find({
      where: {
        domain: domains[0],
        valid: true,
      },
    })
  }
}
