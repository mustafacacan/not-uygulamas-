const jwt = require("jsonwebtoken");
const Response = require("../../services/response");
require("dotenv").config();

const auth = (req, res, next) => {
  try {
    const headers = req.headers.authorization;

    if (!headers && !headers.startsWith("Bearer ")) {
      return new Response(false, "Token bulunamadı").error401(res);
    }

    const token = headers.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    return new Response(false, err.message).error401(res);
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return new Response(false, "Yetkisiz erişim").error403(res);
  }
  next();
};

module.exports = {
  auth,
  isAdmin,
};
