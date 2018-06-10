import { mergeResolvers } from 'merge-graphql-schemas';
import userResolvers from '~/user/resolvers';
import itemResolvers from '~/item/resolvers'
import viewerResolvers from '~/viewer/resolvers';

const resolversArray = [userResolvers, viewerResolvers, itemResolvers];

export default mergeResolvers(resolversArray);
