# Patreon clone

This is simple web app inspired by patreon

## TODO

- Subscribing to higher tier should allow access to all lower tiers as well
- Use union for user type
- Generate default free tier
- add indices in prisma schema
- implement, or generate mappers to use in resolvers instead of using `as any`
- do not allow creating new subscription if the same subscription exists and is not expired
- user should see all posts of followed author, even without subscription - in case of missing subscription post is presented with placeholder/blur graphics, and a link for subscribing
- [graphQl authorization using custom directives](https://www.apollographql.com/docs/apollo-server/security/authentication/#authorization-via-custom-directives)
- add minio for s3 storage
- use token auth for backend and session for nuxt frontend
- add gql error type like ben suggested

- subscription could define user and level/tier
- Model comments, tags and reactions for posts
- add teaser text for post
- add post type [text,image,video,audo,link,polls]
