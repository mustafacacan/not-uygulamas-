const router = require("express").Router();

const { auth, isAdmin } = require("../middleware/auth/authenticate");
const {
  register,
  login,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  deleteUserAdmin,
} = require("../controller/user");

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, getUser);
router.put("/update", auth, updateUser);
router.delete("/delete", auth, deleteUser);
router.get("/all-user", auth, isAdmin, getAllUsers);
router.delete("/delete-user/:id", auth, isAdmin, deleteUserAdmin);

module.exports = router;
