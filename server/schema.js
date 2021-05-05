const { gql } = require('apollo-server-express');
const fs = require('fs');

//type defs
export const typeDefs = gql(fs.readFileSync('./schema.gql'));

//resolvers
export const resolvers = {};
