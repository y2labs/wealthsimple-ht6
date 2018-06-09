const path = require('path');
const { mergeResolvers } = require('merge-graphql-schemas');

const resolversArray = [require('./users/resolvers')];

module.exports = mergeResolvers(resolversArray);
