const express = require("express");
const router = express.Router();
const {
  create,
  arquivo,
  list,
  read,
  remove,
  update,
} = require("../controllers/arquivo");

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.post("/arquivo/criar/:userId", requireSignin, isAuth, isAdmin, create);
router.get("/arquivos", list);
router.get("/arquivo/:arquivoId", read);
router.delete(
  "/arquivo/:arquivoId/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  remove
);
router.put(
  "/arquivo/:userId/:arquivoId",
  requireSignin,
  isAuth,
  isAdmin,
  update
);
router.get("/arquivo/pdf/:arquivoId", arquivo);

router.param("userId", userById);
module.exports = router;
