const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
  },
  login: async ({ email, password }) => {
    let user = await User.findOne({ email: email });
    if (!user) throw Error("User doesn't exist");
    const isEqual = bcrypt.compare(password, user.password); // plain String , hashed String
    if (!isEqual) throw Error(" Password is not Matching ");

    const token = jwt.sign({ userId: user.id, email: email }, "someKey", {
      expiresIn: "1h"
    });
    return {
      userId: user.id,
      token: token,
      tokenExpiration: 1
    };
  }
};
