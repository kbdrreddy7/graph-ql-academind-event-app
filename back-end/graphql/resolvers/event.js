const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require("../../models/booking");
const { transformBooking, transformEvent } = require("./merge");

module.exports = {
  events: async () => {
    try {
      // with manual depth fetch
      let collection = await Event.find({});
      let events = collection.map(eventRef => transformEvent(eventRef));
      return events;
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

      let createdEvent = transformEvent(eventRef);

      let userObj = await User.findById("5d4fc0f73ace5c2e22e4f944");
      if (!userObj) throw Error("User not found");
      userObj.createdEvents.push(event);
      await userObj.save();

      return createdEvent;
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
    return transformBooking(bookingRef);
  }
};
