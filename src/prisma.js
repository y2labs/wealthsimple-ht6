const { Prisma } = require('prisma-binding');

const prisma = new Prisma({
  debug: process.env.NODE_ENV === 'development',
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: process.env.PRISMA_ENDPOINT
});

module.exports = prisma;
