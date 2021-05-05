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
    job: (root, { id }) => db.jobs.get(id),
    company: (root, { id }) => db.companies.get(id),
  },
  Job: {
    company: job => db.companies.get(job.companyId),
  },
  Company: {
    jobs: company => db.jobs.list().filter(job => job.companyId === company.id),
  },
  Mutation: {
    createJob: (root, { input }) => {
      const id = db.jobs.create(input);
      return db.jobs.get(id);
    },
  },
};

module.exports = { typeDefs, resolvers };
