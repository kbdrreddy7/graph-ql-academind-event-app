// this contains all helper functions used in the resolvers
const Event = require("../../models/event");
const User = require("../../models/user");
const DataLoader = require("dataloader");

const { dateToString } = require("../../helpers/date");

const eventLoader = new DataLoader(eventIds => {
  return events(eventIds);
});

// dataloader should return a promise
const userLoader = new DataLoader(userIds => {
  return User.find({ _id: { $in: userIds } });
});

const transformEvent = eventRef => {
  return {
    ...eventRef._doc,
    _id: eventRef.id,
    date: dateToString(eventRef._doc.date),
    creator: user.bind(this, eventRef._doc.creator)
  };
};

const transformBooking = bookingRef => {
  return {
    ...bookingRef._doc,
    _id: bookingRef.id,
    user: user.bind(this, bookingRef._doc.user),
    event: event.bind(this, bookingRef._doc.event),
    createdAt: dateToString(bookingRef._doc.createdAt),
    updatedAt: dateToString(bookingRef._doc.updatedAt)
  };
};

const events = async eventIds => {
  try {
    let eventsCollection = await Event.find({ _id: { $in: eventIds } });
    let events = eventsCollection.map(eventRef => transformEvent(eventRef));
    return events;
  } catch (err) {
    throw err;
  }
};

const event = async eventId => {
  try {
    /* let eventRef =   Event.findOne({ _id: eventId });
    return transformEvent(eventRef);
 */

    let event = await eventLoader.load(eventId.toString());
    // internally it is calling events(ids), which are transformed , no need to do again
    return event;
  } catch (err) {
    throw err;
  }
};

const user = async userId => {
  try {
    let userRef = await userLoader.load(userId.toString()); //await User.findById(userId);
    let user = {
      ...userRef._doc,
      _id: userRef.id,
      createdEvents: () => eventLoader.loadMany(userRef._doc.createdEvents)
      // events.bind(this, userRef._doc.createdEvents)
      //eventLoader.loadMany(userRef._doc.createdEvents)
    };
    return user;
  } catch (err) {
    throw err;
  }
};

exports.transformBooking = transformBooking;
exports.transformEvent = transformEvent;
