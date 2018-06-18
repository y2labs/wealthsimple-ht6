import { GraphQLServer } from 'graphql-yoga';
import typeDefs from '~/schema.graphql';
import resolvers from '~/resolvers';
import prisma from '~/prisma';
import api from '~/api';
import { start as startLoop, stop as stopLoop } from '~/loop';

const graphQLServer = new GraphQLServer({
  resolvers,
  typeDefs,

  context: req => ({
    ...req,
    prisma
  })
});

graphQLServer.use('/', api);

const server = graphQLServer.createHttpServer({
  port: process.env.PORT,
  endpoint: '/api'
});

server.listen(process.env.PORT, () => {
  startLoop();
});

process.on('SIGTERM', () => {
  server.close(() => {
    stopLoop();

    process.exit(0);
  });
});
