const express = require("express");
const router = express.Router();
const {
  create,
  image,
  list,
  read,
  remove,
  update,
} = require("../controllers/slider");

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.post("/slider/criar/:userId", requireSignin, isAuth, isAdmin, create);
router.get("/sliders", list);
router.get("/slider/:sliderId", read);
router.delete(
  "/slider/:sliderId/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  remove
);
router.put("/slider/:userId/:sliderId", requireSignin, isAuth, isAdmin, update);
router.get("/slider/image/:sliderId", image);

router.param("userId", userById);
module.exports = router;
