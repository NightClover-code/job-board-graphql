const URL = 'http://localhost:9000/graphql';

//requests
export const graphQLRequest = async (query, variables = {}) => {
  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });
  const responseBody = await response.json();
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
        company {
          name
          description
        }
      }
    }
  `;
  const { job } = await graphQLRequest(query, { id });
  return job;
};
