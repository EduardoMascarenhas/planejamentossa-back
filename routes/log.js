const express = require("express");
const router = express.Router();

const {
  create,
  logById,
  read,
  remove,
  update,
  list,
} = require("../controllers/log");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.get("/log/:logId", read);
router.post("/log/create/:userId", requireSignin, isAuth, isAdmin, create);
router.delete("/log/:logId/:userId", requireSignin, isAuth, isAdmin, remove);

router.get("/logs/:userId", requireSignin, isAuth, isAdmin, list);

router.param("userId", userById);
router.param("logId", logById);

module.exports = router;
