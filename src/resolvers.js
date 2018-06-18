import { mergeResolvers } from 'merge-graphql-schemas';
import bankAccountsResolvers from './bank-accounts/resolvers';
import accountResovers from './accounts/resolvers';
import userResolvers from '~/user/resolvers';
import itemResolvers from '~/item/resolvers';
import viewerResolvers from '~/viewer/resolvers';
import petResolvers from '~/pet/resolvers';
import demoResolvers from '~/demo/resolvers';
import webPushResolvers from '~/web-push/resolvers';

const resolversArray = [
  userResolvers,
  viewerResolvers,
  itemResolvers,
  bankAccountsResolvers,
  accountResovers,
  petResolvers,
  demoResolvers,
  webPushResolvers
];

export default mergeResolvers(resolversArray);
