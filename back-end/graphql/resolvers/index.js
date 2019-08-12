const authResolver = require("./auth");
const bookingResolver = require("./booking");
const eventResolver = require("./event");

module.exports = {
  ...authResolver,
  ...bookingResolver,
  ...eventResolver
};
