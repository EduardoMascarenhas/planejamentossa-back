const express = require("express");
const router = express.Router();
const {
  create,
  list,
  listRecentes,
  read,
  remove,
  update,
  thumb,
  listSearch,
} = require("../controllers/carta");

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.post("/carta/criar/:userId", requireSignin, isAuth, isAdmin, create);
router.get("/cartas", list);
router.get("/cartas/recentes", listRecentes);
router.get("/carta/:slug", read);
router.delete("/carta/:slug/:userId", requireSignin, isAuth, isAdmin, remove);
router.put("/carta/:userId/:slug", requireSignin, isAuth, isAdmin, update);
router.get("/carta/thumb/:slug", thumb);
router.get("/cartas/search", listSearch);

router.param("userId", userById);
module.exports = router;
