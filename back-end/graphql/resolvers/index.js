const bcrypt = require("bcryptjs");

const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require("../../models/booking");

const events = async eventIds => {
  try {
    let eventsCollection = await Event.find({ _id: { $in: eventIds } });
    let events = eventsCollection.map(eventRef => {
      return {
        ...eventRef._doc,
        _id: eventRef.id,
        date: new Date(eventRef._doc.date).toISOString(),
        creator: user.bind(this, eventRef._doc.creator)
      };
    });

    return events;
  } catch (err) {
    throw err;
  }
};

const event = async eventId => {
  try {
    let eventRef = await Event.findOne({ _id: eventId });
    return {
      ...eventRef._doc,
      _id: eventRef.id,
      date: new Date(eventRef._doc.date).toISOString(),
      creator: user.bind(this, eventRef._doc.creator)
    };
  } catch (err) {
    throw err;
  }
};

const user = async userId => {
  try {
    let userRef = await User.findById(userId);
    let user = {
      ...userRef._doc,
      _id: userRef.id,
      createdEvents: events.bind(this, userRef._doc.createdEvents)
    };
    return user;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  events: async () => {
    /* 
       // dynamic relation using populate('field)
       // without manual depth fetch 

      let collection = await Event.find({}).populate("creator");
        let events = collection.map(docRef => {
        return {
          ...docRef._doc,
          _id: docRef._doc._id.toString(),
          date: new Date(docRef._doc.date).toISOString(),
          creator: {
                ...docRef._doc.creator._doc,
                _id: docRef._doc.creator.id
              }
        };
      });
      return events
      */

    try {
      // with manual depth fetch
      let collection = await Event.find({});
      let events = collection.map(docRef => {
        return {
          ...docRef._doc,
          _id: docRef._doc._id.toString(),
          date: new Date(docRef._doc.date).toISOString(),
          creator: user.bind(this, docRef._doc.creator) // here manual depth fetch
        };
      });
      return events;
    } catch (err) {
      throw err;
    }
  },
  bookings: async () => {
    try {
      let bookingCol = await Booking.find({});
      return bookingCol.map(bookingRef => {
        return {
          ...bookingRef._doc,
          _id: bookingRef.id,
          user: user.bind(this, bookingRef._doc.user),
          event: event.bind(this, bookingRef._doc.event),
          createdAt: new Date(bookingRef._doc.createdAt).toISOString(),
          updatedAt: new Date(bookingRef._doc.updatedAt).toISOString()
        };
      });
    } catch (err) {
      throw err;
    }
  },

  createEvent: async args => {
    try {
      let { eventInput } = args;
      let event = new Event({
        title: eventInput.title,
        description: eventInput.description,
        price: +eventInput.price,
        date: new Date(eventInput.date),
        creator: "5d4fc0f73ace5c2e22e4f944"
      });

      let eventRef = await event.save();

      let createdEvent = {
        ...eventRef._doc,
        _id: eventRef.id,
        creator: user.bind(this, eventRef._doc.creator)
      };

      let userObj = await User.findById("5d4fc0f73ace5c2e22e4f944");
      if (!userObj) throw Error("User not found");
      userObj.createdEvents.push(event);
      await userObj.save();

      return createdEvent;
    } catch (err) {
      throw err;
    }
  },
  createUser: async args => {
    try {
      let { userInput } = args;
      let result = await User.findOne({ email: userInput.email });
      if (result) throw new Error(" User already exist");
      // string and salt rounds
      let hashedPassword = await bcrypt.hash(userInput.password, 12);
      let user = new User({
        email: userInput.email,
        password: hashedPassword
      });

      let userRef = await user.save();
      return { ...userRef._doc, password: null, _id: userRef.id };
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async args => {
    let fetchedEvent = await Event.findById(args.eventId);

    let booking = new Booking({
      user: "5d4fc0f73ace5c2e22e4f944",
      event: fetchedEvent
    });

    let bookingRef = await booking.save();
    return {
      ...bookingRef._doc,
      _id: bookingRef.id,
      user: user.bind(this, bookingRef._doc.user),
      event: event.bind(this, bookingRef._doc.event),
      createdAt: new Date(bookingRef._doc.createdAt).toISOString(),
      updatedAt: new Date(bookingRef._doc.updatedAt).toISOString()
    };
  },
  cancelBooking: async args => {
    try {
      let bookingRef = await Booking.findById(args.bookingId).populate("event");

      let event = {
        ...bookingRef._doc.event._doc,
        _id: bookingRef._doc.event.id,
        creator: user.bind(this, bookingRef._doc.user)
      };

      await Booking.deleteOne({ _id: args.bookingId });

      return event;
    } catch (err) {
      throw err;
    }
  }
};
