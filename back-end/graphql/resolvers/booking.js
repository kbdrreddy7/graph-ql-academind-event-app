const Booking = require("../../models/booking");
const { transformBooking, transformEvent } = require("./merge");

module.exports = {
  bookings: async () => {
    try {
      let bookingCol = await Booking.find({});
      return bookingCol.map(bookingRef => transformBooking(bookingRef));
    } catch (err) {
      throw err;
    }
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) throw new Error("Unauthenticated");

    try {
      let bookingRef = await Booking.findById(args.bookingId).populate("event");
      let event = transformEvent(bookingRef.event); // transformEvent(bookingRef._doc.event) // both works
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  }
};
