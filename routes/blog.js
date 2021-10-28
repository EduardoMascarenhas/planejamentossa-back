const express = require("express");
const router = express.Router();
const { create, list, read, remove, update } = require("../controllers/blog");

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.post("/noticia/criar/:userId", requireSignin, isAuth, isAdmin, create);
router.get("/noticias", list);
router.get("/noticia/:slug", read);
router.delete("/noticia/:slug/:userId", requireSignin, isAuth, isAdmin, remove);
router.put("/noticia/:userId/:slug", requireSignin, isAuth, isAdmin, update);

router.param("userId", userById);
module.exports = router;
