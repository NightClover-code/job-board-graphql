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
