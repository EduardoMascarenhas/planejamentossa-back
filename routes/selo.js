const express = require("express");
const router = express.Router();
const {
  create,
  image,
  list,
  read,
  remove,
  update,
} = require("../controllers/selo");

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.post("/selo/criar/:userId", requireSignin, isAuth, isAdmin, create);
router.get("/selos", list);
router.get("/selo/:seloId", read);
router.delete("/selo/:seloId/:userId", requireSignin, isAuth, isAdmin, remove);
router.put("/selo/:userId/:seloId", requireSignin, isAuth, isAdmin, update);
router.get("/selo/image/:seloId", image);

router.param("userId", userById);
module.exports = router;
