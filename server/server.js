//importing dependecies
const cors = require('cors');
const express = require('express');
const expressJwt = require('express-jwt');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const db = require('./db');
//importing graphql utils
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schema');

//port && secret
const PORT = 9000;
const jwtSecret = Buffer.from('Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt', 'base64');

//init express server
const app = express();
app.use(
  cors(),
  bodyParser.json(),
  expressJwt({
    secret: jwtSecret,
    credentialsRequired: false,
  })
);

//init graphql server
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});
apolloServer.applyMiddleware({ app });

//routes
app.post('/login', (req, res) => {
  const user = db.users.list().find(user => user.email === req.body.email);
  if (!(user && user.password === req.body.password)) {
    res.sendStatus(401);
    return;
  }
  const token = jwt.sign({ sub: user.id }, jwtSecret);
  res.send({ token });
});

//listening
app.listen(PORT, () =>
  console.info(`Server started on port ${PORT}, visit http://localhost:${PORT}`)
);
