const { Prisma } = require('prisma-binding');
const fs = require('fs');
const path = require('path');

const typeDefs = fs.readFileSync(
  path.join(__dirname, '..', 'src', 'generated', 'prisma.graphql'),
  'utf-8'
);

const prisma = new Prisma({
  debug: true,
  endpoint: process.env.PRISMA_ENDPOINT,
  typeDefs
});

module.exports = prisma;
