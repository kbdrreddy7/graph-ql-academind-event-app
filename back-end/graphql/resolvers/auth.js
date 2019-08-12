const bcrypt = require("bcryptjs");

const User = require("../../models/user");

module.exports = {
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
  }
};
