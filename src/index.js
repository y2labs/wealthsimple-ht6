const { GraphQLServer } = require('graphql-yoga');
const resolvers = require('./resolvers');
const apiRouter = require('./api');
const prisma = require('./prisma');
const { start: startLoop, stop: stopLoop } = require('./loop');

const graphQLServer = new GraphQLServer({
  typeDefs: 'src/schema.graphql',
  resolvers,

  context: req => {
    req.prisma = prisma;

    return req;
  }
});

graphQLServer.use('/', apiRouter);

const server = graphQLServer.createHttpServer({
  port: process.env.PORT
});

server.listen(process.env.PORT, () => {
  startLoop();
});

['SIGTERM', 'SIGINT'].forEach(signal => {
  process.on(signal, () => {
    server.close(() => {
      stopLoop();
    });
  });
});
