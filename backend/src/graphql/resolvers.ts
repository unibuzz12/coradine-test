import { IResolvers } from '@graphql-tools/utils';
import { merge } from 'lodash';
import UserResolvers from './resolvers/userResolvers';
import CollectionResolvers from './resolvers/collectionResolvers';
import AlbumResolvers from './resolvers/albumResolvers';

const resolverMap: IResolvers = merge(UserResolvers, CollectionResolvers, AlbumResolvers);

export default resolverMap;