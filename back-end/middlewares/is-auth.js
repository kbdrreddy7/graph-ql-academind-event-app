const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  /* 
  console.log("req.headers", req.headers);
  console.log("************************************************************");
  console.log("req.params", req.params);
  console.log("************************************************************");

  console.log("req.query", req.query);
  console.log("************************************************************");

  console.log("req.body", req.body);
  console.log("************************************************************");
  console.log("************************************************************");
 */
  let authHeader = req.get("Authorization");
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }

  const token = authHeader.split(" ")[1]; // Authorization : Bearer token
  if (!token || token === "") {
    req.isAuth = false;
    return next();
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "someKey");
  } catch (err) {
    req.isAuth = false;
    return next();
  }

  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }
  req.isAuth = true;
  req.userId = decodedToken.userId;
  next();
};
