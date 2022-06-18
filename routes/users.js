const router = require("express").Router();
const {
  createUser,
  getUsers,
  getUser,
  updateProfile,
  updateAvatar,
} = require("../controllers/users");

router.post("/", createUser);

router.get("/", getUsers);

router.get("/:userId", getUser);

router.patch("/me", updateProfile);

router.patch("/me/avatar", updateAvatar);

module.exports = router;
