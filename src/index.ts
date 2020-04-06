import 'reflect-metadata'
import { createConnection } from 'typeorm'
import { ApolloServer } from 'apollo-server'
import { buildSchema } from 'type-graphql'
import { DomainResolver } from './resolvers/DomainResolver'
import { PathResolver } from './resolvers/PathResolver'
import { StatusResolver } from './resolvers/StatusResolver'

async function main() {
  const connection = await createConnection()
  const schema = await buildSchema({
    resolvers: [DomainResolver, PathResolver, StatusResolver],
  })
  const server = new ApolloServer({ schema })
  await server.listen(4000)
  console.log('Server has started!')
}

main()
