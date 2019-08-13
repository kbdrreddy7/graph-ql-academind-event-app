// this contains all helper functions used in the resolvers
const Event = require("../../models/event");
const User = require("../../models/user");

const { dateToString } = require("../../helpers/date");

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
    let eventRef = await Event.findOne({ _id: eventId });
    return transformEvent(eventRef);
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

exports.transformBooking = transformBooking;
exports.transformEvent = transformEvent;
