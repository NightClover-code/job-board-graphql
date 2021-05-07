//importing auth utils
import { getAccessToken, isLoggedIn } from './auth';
//importing apollo
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
//graphql server url
const URL = 'http://localhost:9000/graphql';

//setting upn apollo client
const client = new ApolloClient({
  link: new HttpLink({ uri: URL }),
  cache: new InMemoryCache(),
});

//requests
export const graphQLRequest = async (query, variables = {}) => {
  //request params
  const request = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  };
  //authorizing authentificated users
  if (isLoggedIn()) {
    request.headers['authorization'] = 'Bearer ' + getAccessToken();
  }
  //fetching graphql data
  const response = await fetch(URL, request);
  const responseBody = await response.json();
  //checking for errors
  if (responseBody.errors) {
    const message = responseBody.errors.map(err => err.message).join('\n');
    throw new Error(message);
  }
  return responseBody.data;
};

export const loadJobs = async () => {
  const query = `
        {
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
  const { jobs } = await graphQLRequest(query);
  return jobs;
};

export const loadJob = async id => {
  const query = `
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
  const { job } = await graphQLRequest(query, { id });
  return job;
};

export const loadCompany = async id => {
  const query = `
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
  const { company } = await graphQLRequest(query, { id });
  return company;
};

export const createJob = async input => {
  const mutation = `
    mutation CreateJob($input: CreateJobInput) {
      job: createJob(input: $input) {
        id
        title
        company {
          id
          name
        }
      }
    }
  `;
  const { job } = await graphQLRequest(mutation, { input });
  return job;
};
