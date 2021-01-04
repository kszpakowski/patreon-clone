# GraphQL example queries and mutations

## Query

### Me

```graphql
{
  me {
    id
    name
    email
    posts {
      title
      tier {
        name
      }
    }
    tiers {
      id
      name
      price
    }
    subscriptions {
      tier {
        id
        name
        owner {
          email
        }
      }
      expiresAt
    }
  }
}
```

### Profile

```graphql
{
  profile(name: "Karol") {
    name
    posts {
      title
      createdAt
      id
      tier {
        name
        id
      }
    }
  }
}
```

## Mutations

### Register

```graphql
mutation {
  register(
    registerInput: { email: "test-user4@pc", password: "123456", name: "Jonas" }
  ) {
    email
    id
  }
}
```

### Login

```graphql
mutation {
  login(loginInput: { email: "test-user4@pc", password: "123456" }) {
    token
    errors {
      message
    }
  }
}
```

### Subscribe

```graphql
mutation {
  subscribe(subscribeInput: { tierId: 2 }) {
    tier {
      owner {
        email
      }
    }
  }
}
```

### Create post

```graphql
mutation {
  createPost(createPostInput: { title: "My new project teaser", tierId: 1 }) {
    title
    id
  }
}
```
