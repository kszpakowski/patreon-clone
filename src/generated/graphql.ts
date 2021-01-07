import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};


export type Node = {
  id: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<User>;
  profile?: Maybe<Profile>;
  posts?: Maybe<Array<Maybe<Post>>>;
};


export type QueryProfileArgs = {
  name: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  register?: Maybe<User>;
  login?: Maybe<LoginResponse>;
  createTier?: Maybe<Tier>;
  createPost: Post;
  commentPost: CommentPostResponse;
  subscribe?: Maybe<TierSubscription>;
  uploadPostAttachment?: Maybe<UploadResponse>;
  uploadAvatar?: Maybe<UploadResponse>;
  uploadCoverPhoto?: Maybe<UploadResponse>;
};


export type MutationRegisterArgs = {
  registerInput: RegisterUserInput;
};


export type MutationLoginArgs = {
  loginInput: LoginInput;
};


export type MutationCreateTierArgs = {
  createTierInput: CreateTierInput;
};


export type MutationCreatePostArgs = {
  createPostInput: CreatePostInput;
};


export type MutationCommentPostArgs = {
  commentPostInput?: Maybe<CommentPostInput>;
};


export type MutationSubscribeArgs = {
  subscribeInput: SubscribeTierInput;
};


export type MutationUploadPostAttachmentArgs = {
  postUploadInput: PostUploadInput;
};


export type MutationUploadAvatarArgs = {
  fileName: Scalars['String'];
};


export type MutationUploadCoverPhotoArgs = {
  fileName: Scalars['String'];
};

export type UploadResponse = {
  __typename?: 'UploadResponse';
  uploadUrl?: Maybe<Scalars['String']>;
  errors?: Maybe<Array<Maybe<Error>>>;
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  token?: Maybe<Scalars['String']>;
  errors?: Maybe<Array<Maybe<Error>>>;
};

export type CommentPostResponse = {
  __typename?: 'CommentPostResponse';
  comment?: Maybe<Comment>;
  errors?: Maybe<Array<Maybe<Error>>>;
};

export type Error = {
  __typename?: 'Error';
  field?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  code: Scalars['String'];
};

export type User = Node & {
  __typename?: 'User';
  id: Scalars['Int'];
  name: Scalars['String'];
  avatarUrl?: Maybe<Scalars['String']>;
  coverPhotoUrl?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  bio?: Maybe<Scalars['String']>;
  tiers?: Maybe<Array<Maybe<Tier>>>;
  posts?: Maybe<Array<Maybe<Post>>>;
  subscriptions?: Maybe<Array<Maybe<TierSubscription>>>;
};

export type Profile = {
  __typename?: 'Profile';
  name: Scalars['String'];
  avatarUrl?: Maybe<Scalars['String']>;
  coverPhotoUrl?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  tiers?: Maybe<Array<Maybe<Tier>>>;
  posts?: Maybe<Array<Maybe<Post>>>;
};

export type Tier = Node & {
  __typename?: 'Tier';
  id: Scalars['Int'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['Float']>;
  owner: User;
};

export type TierSubscription = Node & {
  __typename?: 'TierSubscription';
  id: Scalars['Int'];
  tier: Tier;
  autoRenewal: Scalars['Boolean'];
  expiresAt: Scalars['Date'];
};

export type Post = Node & {
  __typename?: 'Post';
  id: Scalars['Int'];
  tier?: Maybe<Tier>;
  title?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
  author: User;
  createdAt: Scalars['Date'];
  attachments?: Maybe<Array<Maybe<Attachment>>>;
  comments?: Maybe<Array<Maybe<Comment>>>;
};

export type Attachment = {
  __typename?: 'Attachment';
  url: Scalars['String'];
  name?: Maybe<Scalars['String']>;
};

export type Comment = Node & {
  __typename?: 'Comment';
  id: Scalars['Int'];
  createdAt: Scalars['Date'];
  author: Profile;
  message: Scalars['String'];
  replies?: Maybe<Array<Maybe<Comment>>>;
  likes: Scalars['Int'];
  deleted: Scalars['Boolean'];
};

export type RegisterUserInput = {
  name: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};

export type CreateTierInput = {
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['Float']>;
};

export type SubscribeTierInput = {
  tierId: Scalars['Int'];
};

export type CreatePostInput = {
  title: Scalars['String'];
  teaserText?: Maybe<Scalars['String']>;
  tierId: Scalars['Int'];
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type PostUploadInput = {
  postId: Scalars['Int'];
  fileName: Scalars['String'];
};

export type CommentPostInput = {
  message: Scalars['String'];
  postId: Scalars['Int'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Date: ResolverTypeWrapper<Scalars['Date']>;
  Node: ResolversTypes['User'] | ResolversTypes['Tier'] | ResolversTypes['TierSubscription'] | ResolversTypes['Post'] | ResolversTypes['Comment'];
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Mutation: ResolverTypeWrapper<{}>;
  UploadResponse: ResolverTypeWrapper<UploadResponse>;
  LoginResponse: ResolverTypeWrapper<LoginResponse>;
  CommentPostResponse: ResolverTypeWrapper<CommentPostResponse>;
  Error: ResolverTypeWrapper<Error>;
  User: ResolverTypeWrapper<User>;
  Profile: ResolverTypeWrapper<Profile>;
  Tier: ResolverTypeWrapper<Tier>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  TierSubscription: ResolverTypeWrapper<TierSubscription>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Post: ResolverTypeWrapper<Post>;
  Attachment: ResolverTypeWrapper<Attachment>;
  Comment: ResolverTypeWrapper<Comment>;
  RegisterUserInput: RegisterUserInput;
  CreateTierInput: CreateTierInput;
  SubscribeTierInput: SubscribeTierInput;
  CreatePostInput: CreatePostInput;
  LoginInput: LoginInput;
  PostUploadInput: PostUploadInput;
  CommentPostInput: CommentPostInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Date: Scalars['Date'];
  Node: ResolversParentTypes['User'] | ResolversParentTypes['Tier'] | ResolversParentTypes['TierSubscription'] | ResolversParentTypes['Post'] | ResolversParentTypes['Comment'];
  Int: Scalars['Int'];
  Query: {};
  String: Scalars['String'];
  Mutation: {};
  UploadResponse: UploadResponse;
  LoginResponse: LoginResponse;
  CommentPostResponse: CommentPostResponse;
  Error: Error;
  User: User;
  Profile: Profile;
  Tier: Tier;
  Float: Scalars['Float'];
  TierSubscription: TierSubscription;
  Boolean: Scalars['Boolean'];
  Post: Post;
  Attachment: Attachment;
  Comment: Comment;
  RegisterUserInput: RegisterUserInput;
  CreateTierInput: CreateTierInput;
  SubscribeTierInput: SubscribeTierInput;
  CreatePostInput: CreatePostInput;
  LoginInput: LoginInput;
  PostUploadInput: PostUploadInput;
  CommentPostInput: CommentPostInput;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type NodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = {
  __resolveType: TypeResolveFn<'User' | 'Tier' | 'TierSubscription' | 'Post' | 'Comment', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  profile?: Resolver<Maybe<ResolversTypes['Profile']>, ParentType, ContextType, RequireFields<QueryProfileArgs, 'name'>>;
  posts?: Resolver<Maybe<Array<Maybe<ResolversTypes['Post']>>>, ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  register?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationRegisterArgs, 'registerInput'>>;
  login?: Resolver<Maybe<ResolversTypes['LoginResponse']>, ParentType, ContextType, RequireFields<MutationLoginArgs, 'loginInput'>>;
  createTier?: Resolver<Maybe<ResolversTypes['Tier']>, ParentType, ContextType, RequireFields<MutationCreateTierArgs, 'createTierInput'>>;
  createPost?: Resolver<ResolversTypes['Post'], ParentType, ContextType, RequireFields<MutationCreatePostArgs, 'createPostInput'>>;
  commentPost?: Resolver<ResolversTypes['CommentPostResponse'], ParentType, ContextType, RequireFields<MutationCommentPostArgs, never>>;
  subscribe?: Resolver<Maybe<ResolversTypes['TierSubscription']>, ParentType, ContextType, RequireFields<MutationSubscribeArgs, 'subscribeInput'>>;
  uploadPostAttachment?: Resolver<Maybe<ResolversTypes['UploadResponse']>, ParentType, ContextType, RequireFields<MutationUploadPostAttachmentArgs, 'postUploadInput'>>;
  uploadAvatar?: Resolver<Maybe<ResolversTypes['UploadResponse']>, ParentType, ContextType, RequireFields<MutationUploadAvatarArgs, 'fileName'>>;
  uploadCoverPhoto?: Resolver<Maybe<ResolversTypes['UploadResponse']>, ParentType, ContextType, RequireFields<MutationUploadCoverPhotoArgs, 'fileName'>>;
};

export type UploadResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['UploadResponse'] = ResolversParentTypes['UploadResponse']> = {
  uploadUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<Maybe<ResolversTypes['Error']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LoginResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginResponse'] = ResolversParentTypes['LoginResponse']> = {
  token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<Maybe<ResolversTypes['Error']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CommentPostResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CommentPostResponse'] = ResolversParentTypes['CommentPostResponse']> = {
  comment?: Resolver<Maybe<ResolversTypes['Comment']>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<Maybe<ResolversTypes['Error']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Error'] = ResolversParentTypes['Error']> = {
  field?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  avatarUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  coverPhotoUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  bio?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tiers?: Resolver<Maybe<Array<Maybe<ResolversTypes['Tier']>>>, ParentType, ContextType>;
  posts?: Resolver<Maybe<Array<Maybe<ResolversTypes['Post']>>>, ParentType, ContextType>;
  subscriptions?: Resolver<Maybe<Array<Maybe<ResolversTypes['TierSubscription']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProfileResolvers<ContextType = any, ParentType extends ResolversParentTypes['Profile'] = ResolversParentTypes['Profile']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  avatarUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  coverPhotoUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bio?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tiers?: Resolver<Maybe<Array<Maybe<ResolversTypes['Tier']>>>, ParentType, ContextType>;
  posts?: Resolver<Maybe<Array<Maybe<ResolversTypes['Post']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TierResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tier'] = ResolversParentTypes['Tier']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  price?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TierSubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['TierSubscription'] = ResolversParentTypes['TierSubscription']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  tier?: Resolver<ResolversTypes['Tier'], ParentType, ContextType>;
  autoRenewal?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  expiresAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PostResolvers<ContextType = any, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  tier?: Resolver<Maybe<ResolversTypes['Tier']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  attachments?: Resolver<Maybe<Array<Maybe<ResolversTypes['Attachment']>>>, ParentType, ContextType>;
  comments?: Resolver<Maybe<Array<Maybe<ResolversTypes['Comment']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AttachmentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Attachment'] = ResolversParentTypes['Attachment']> = {
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CommentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Comment'] = ResolversParentTypes['Comment']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['Profile'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  replies?: Resolver<Maybe<Array<Maybe<ResolversTypes['Comment']>>>, ParentType, ContextType>;
  likes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  deleted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Date?: GraphQLScalarType;
  Node?: NodeResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  UploadResponse?: UploadResponseResolvers<ContextType>;
  LoginResponse?: LoginResponseResolvers<ContextType>;
  CommentPostResponse?: CommentPostResponseResolvers<ContextType>;
  Error?: ErrorResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  Profile?: ProfileResolvers<ContextType>;
  Tier?: TierResolvers<ContextType>;
  TierSubscription?: TierSubscriptionResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  Attachment?: AttachmentResolvers<ContextType>;
  Comment?: CommentResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
