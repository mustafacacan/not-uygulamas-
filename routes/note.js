const router = require("express").Router();

const {
  createNote,
  getAllNotes,
  getUserNotes,
  updateNote,
  deleteNote,
} = require("../controller/notes");
const { auth, isAdmin } = require("../middleware/auth/authenticate");

router.post("/create", auth, createNote);
router.get("/all-notes", auth, isAdmin, getAllNotes);
router.get("/my-notes", auth, getUserNotes);
router.put("/update/:id", auth, updateNote);
router.delete("/delete/:id", auth, deleteNote);

module.exports = router;
