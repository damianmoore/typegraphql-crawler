# Web Crawler based on TypeGraphQL and TypeORM

This demo project is a web crawler that, when given a domain name, will follow all href links recursively until it builds a list of all URI paths. All interaction is done via GraphQL and there is no UI.

You submit a domain using a mutation, view progress using a subscription and view all collected paths with a query. GraphQL Playground is provided.

TypeORM is configured to use SQLite as the default database so results will be stored in a file in the same directory. You can browse and query the database with common tools such as DBeaver.

## Set-up

Once the repository is cloned, install package dependencies with Yarn:

    yarn

Start the server:

    yarn start

Go to http://localhost:4000 to access the GraphQL Playground.

## Usage

Add your domain name as a mutation to begin crawl immediately (note that you will need to pick a domain yourself as example.com blocks this kind of traffic):

```
mutation {
  addDomain(name: "example.com") {
    name
  }
}
```

Watch for updates as paths are being fetched (not presently notifying correctly):

```
subscription {
  normalSubscription {
    id
    message
    date
  }
}
```

Once crawling is complete, get the list of URI paths with this query:

```
query {
  getPaths(name: "example.com") {
    uri
  }
}
```

## Further consideratons and possible refinements

- If a href URL results in a redirect (301 or 302) should we add the new Path and mark the old one as not valid?

- We can be more robust around HTTP/HTTPS, i.e. have a fallback and take note of preference per site.

- It would be good to know when all sublinks have been exhausted rather than having to monitor.
