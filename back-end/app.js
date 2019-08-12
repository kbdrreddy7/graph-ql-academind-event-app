require("./env");
const express = require("express");
const cors = require("cors");
const graphqlHTTP = require("express-graphql");
const mongoose = require("mongoose");

const graphQlSchema = require("./graphql/schema");
const graphResolvers = require("./graphql/resolvers");

const app = express();

app.use(cors());

app.get("/", (req, res) => res.send("Hello World!"));

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphResolvers,
    graphiql: true
  })
);

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() =>
    app.listen(process.env.PORT, () =>
      console.log(" app listening on port ", process.env.PORT)
    )
  )
  .catch(err => console.log(" err ", err));
