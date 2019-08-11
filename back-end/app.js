/*
 import "./env";
import express from "express";
import cors from "cors";
import { buildSchema } from "graphql";
import graphqlHTTP from "express-graphql";
import mongoose from "mongoose";

import Event from "./models/event";
 */
require("./env");
const express = require("express");
const cors = require("cors");
const buildSchema = require("graphql").buildSchema;
const graphqlHTTP = require("express-graphql");
const mongoose = require("mongoose");

const Event = require("./models/event");

const app = express();

app.use(cors());

app.get("/", function(req, res) {
  res.send("Hello World!");
});

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
      events: () => {
        return Event.find({})
          .then(collection => {
            return collection.map(docRef => {
              return { ...docRef._doc, _id: docRef._doc._id.toString() };
            });
          })
          .catch(err => {
            throw err;
          });
      },

      createEvent: args => {
        let { eventInput } = args;

        //let event = JSON.parse(JSON.stringify(eventInput));
        // event._id = Math.random().toString();
        /*  
        let event = {
          ...eventInput,
          _id: Math.random().toString()
        }; */

        let event = new Event({
          title: eventInput.title,
          description: eventInput.description,
          price: +eventInput.price,
          date: new Date(eventInput.date)
        });

        return event
          .save()
          .then(docRef => {
            return { ...docRef._doc, _id: docRef.id };
          })
          .catch(err => {
            throw err;
          });
      }
    },
    graphiql: true
  })
);

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    app.listen(process.env.PORT, function() {
      console.log(" app listening on port ", process.env.PORT);
    });
  })
  .catch(err => {
    console.log(" err ", err);
  });
