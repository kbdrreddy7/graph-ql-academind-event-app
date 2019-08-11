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
const bcrypt = require("bcryptjs");

const Event = require("./models/event");
const User = require("./models/user");

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

    type User{
      _id:ID
      email:String!
      password:String
    }
 input UserInput{
      email:String!
      password:String!
    }
   
    type RootQuery{
        events:[Event!]!
    }
    type RootMutation{
        createEvent(eventInput:EventInput):Event
        createUser(userInput:UserInput):User

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
          date: new Date(eventInput.date),
          creator: "5d4fc0f73ace5c2e22e4f944"
        });

        let createdEvent;
        return event
          .save()
          .then(eventRef => {
            createdEvent = { ...eventRef._doc, _id: eventRef.id };
            return User.findById("5d4fc0f73ace5c2e22e4f944");
          })
          .then(user => {
            if (!user) throw Error("User not found");

            user.createdEvents.push(event);
            return user.save();
          })
          .then(userRef => {
            // return { ...userRef._doc, _id: userRef.id };
            return createdEvent;
          })
          .catch(err => {
            throw err;
          });
      },
      createUser: args => {
        let { userInput } = args;

        return User.findOne({ email: userInput.email })
          .then(result => {
            if (result) throw new Error(" User already exist");
            // string and salt rounds
            return bcrypt.hash(userInput.password, 12);
          })
          .then(hashedPassword => {
            let user = new User({
              email: userInput.email,
              password: hashedPassword
            });

            return user.save();
          })
          .then(userRef => {
            return { ...userRef._doc, password: null, _id: userRef.id };
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
  .then(() =>
    app.listen(process.env.PORT, () =>
      console.log(" app listening on port ", process.env.PORT)
    )
  )
  .catch(err => console.log(" err ", err));
