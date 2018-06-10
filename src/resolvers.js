import { mergeResolvers } from 'merge-graphql-schemas';
import bankAccountsResolvers from './bank-accounts/resolvers';
import userResolvers from '~/user/resolvers';
import itemResolvers from '~/item/resolvers';
import viewerResolvers from '~/viewer/resolvers';

const resolversArray = [
  userResolvers,
  viewerResolvers,
  itemResolvers,
  bankAccountsResolvers
];

export default mergeResolvers(resolversArray);
