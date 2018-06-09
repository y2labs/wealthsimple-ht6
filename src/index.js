const { GraphQLServer } = require('graphql-yoga');
const resolvers = require('./resolvers');
const apiRouter = require('./api');
const prisma = require('./prisma');

const server = new GraphQLServer({
  typeDefs: 'src/schema.graphql',
  resolvers,

  context: req => {
    req.prisma = prisma;

    return req;
  }
});

server.use('/', apiRouter);

server.start({
  port: process.env.PORT
});
