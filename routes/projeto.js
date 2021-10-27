const express = require("express");
const router = express.Router();
const {
  create,
  list,
  read,
  remove,
  update,
} = require("../controllers/projeto");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.post("/projeto/criar/:userId", requireSignin, isAuth, isAdmin, create);
router.get("/projetos", list);
router.get("/projeto/:slug", read);
router.put("/projeto/:userId/:slug", requireSignin, isAuth, isAdmin, update);
router.delete("/projeto/:slug/:userId", requireSignin, isAuth, isAdmin, remove);

router.param("userId", userById);
module.exports = router;
