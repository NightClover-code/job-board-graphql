const { gql } = require('apollo-server-express');
const fs = require('fs');
const db = require('./db');

//type defs
const typeDefs = gql(
  fs.readFileSync('./schema.gql', {
    encoding: 'utf-8',
  })
);

//resolvers
const resolvers = {
  Query: {
    jobs: () => db.jobs.list(),
    job: (root, args) => db.jobs.get(args.id),
  },
  Job: {
    company: job => db.companies.get(job.companyId),
  },
};

module.exports = { typeDefs, resolvers };
