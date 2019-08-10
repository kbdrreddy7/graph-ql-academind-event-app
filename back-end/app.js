import express from "express";
import cors from "cors";
import { buildSchema } from "graphql";
import graphqlHTTP from "express-graphql";

const app = express();

app.use(cors());

app.get("/", function(req, res) {
  res.send("Hello World!");
});

let events = [];
app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`

    type Event{
      _id:ID
      title:String!
      description:String!
      price:Float!
      date:String!

    }

    input EventInput{
      title:String!
      description:String!
      price:Float!
      date:String!
    }
    type RootQuery{
        events:[Event!]!
    }
    type RootMutation{
        createEvent(eventInput:EventInput):Event
    }
    schema{
        query:RootQuery,
        mutation:RootMutation
    }
    `),
    rootValue: {
      events: () => events,

      createEvent: args => {
        let { eventInput } = args;

        let event = JSON.parse(JSON.stringify(eventInput));
        event._id = Math.random().toString();
        /*  not working
        let event = {
          ...eventInput,
          _id: Math.random().toString()
        }; */
        console.log(eventInput, event);
        events.push(event);
        return event;
      }
    },
    graphiql: true
  })
);

let PORT = 5000;
app.listen(PORT, function() {
  console.log("Example app listening on port ", PORT);
});
