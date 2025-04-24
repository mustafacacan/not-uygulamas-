const router = require("express").Router();

const user = require("./user");
const notes = require("./note");

router.use("/user", user);
router.use("/notes", notes);

module.exports = router;
