import { Prisma } from 'prisma-binding';
import typeDefs from '~/generated/prisma.graphql';

const prisma = new Prisma({
  debug: process.env.NODE_ENV === 'development' && process.env.PRISMA_DEBUG,
  endpoint: process.env.PRISMA_ENDPOINT,
  typeDefs
});

export default prisma;
