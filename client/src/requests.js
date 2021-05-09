//importing auth utils
import { getAccessToken, isLoggedIn } from './auth';
//importing apollo
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloLink,
} from '@apollo/client';
import gql from 'graphql-tag';

//graphql server url
const URL = 'http://localhost:9000/graphql';

//authorizing authentificated users
const authLink = new ApolloLink((operation, forward) => {
  if (isLoggedIn()) {
    operation.setContext({
      headers: {
        authorization: 'Bearer ' + getAccessToken(),
      },
    });
  }
  return forward(operation);
});

//setting up apollo client
const client = new ApolloClient({
  link: new ApolloLink.from([authLink, new HttpLink({ uri: URL })]),
  cache: new InMemoryCache(),
});

//queries
const companyQuery = gql`
  query CompanyQuery($id: ID!) {
    company(id: $id) {
      id
      name
      description
      jobs {
        id
        title
      }
    }
  }
`;

const jobQuery = gql`
  query JobQuery($id: ID!) {
    job(id: $id) {
      id
      title
      description
      company {
        id
        name
        description
      }
    }
  }
`;

const jobsQuery = gql`
  query JobsQuery {
    jobs {
      id
      title
      company {
        id
        name
      }
    }
  }
`;

//mutations
const createJobMutation = gql`
  mutation CreateJob($input: CreateJobInput) {
    job: createJob(input: $input) {
      id
      title
      description
      company {
        id
        name
      }
    }
  }
`;

//requests
export const loadJobs = async () => {
  const {
    data: { jobs },
  } = await client.query({ query: jobsQuery, fetchPolicy: 'no-cache' });
  return jobs;
};

export const loadJob = async id => {
  const {
    data: { job },
  } = await client.query({ variables: { id }, query: jobQuery });
  return job;
};

export const loadCompany = async id => {
  const {
    data: { company },
  } = await client.query({ query: companyQuery, variables: { id } });
  return company;
};

export const createJob = async input => {
  const {
    data: { job },
  } = await client.mutate({
    mutation: createJobMutation,
    variables: { input },
    //saving data to cache
    update: (cache, { data }) => {
      cache.writeQuery({
        query: jobQuery,
        variables: { id: data.job.id },
        data,
      });
    },
  });
  return job;
};
