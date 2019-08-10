import express from "express";
import cors from "cors";
import { buildSchema } from "graphql";
import graphqlHTTP from "express-graphql";

const app = express();

app.use(cors());

app.get("/", function(req, res) {
  res.send("Hello World!");
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
    type RootQuery{
        events:[String!]!
    }
    type RootMutation{
        createEvent(name:String):String
    }
    schema{
        query:RootQuery,
        mutation:RootMutation
    }
    `),
    rootValue: {
      events: () => ["Academind", "sir", "guru"],

      createEvent: args => `name is ${args.name}`
    },
    graphiql: true
  })
);

let PORT = 5000;
app.listen(PORT, function() {
  console.log("Example app listening on port ", PORT);
});
