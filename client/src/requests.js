const URL = 'http://localhost:9000/graphql';

//requests
export const loadJobs = async () => {
  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: `
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
        `,
    }),
  });
  const responseBody = await response.json();
  return responseBody.data.jobs;
};

export const loadJob = async id => {
  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: `
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
        `,
      variables: {
        id,
      },
    }),
  });
  const responseBody = await response.json();
  return responseBody.data.job;
};
