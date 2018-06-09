const path = require('path');
const { mergeResolvers } = require('merge-graphql-schemas');

const resolversArray = [require('./user/resolvers')];

module.exports = mergeResolvers(resolversArray);
