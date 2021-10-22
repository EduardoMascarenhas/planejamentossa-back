const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");

const {
  userById,
  read,
  update,
  updateDados,
  updateRole,
  updateAprovar,
  listUsers,
  listUsersByName,
  activateUserByEmail,
  userByEmail,
  updatePassword,
  remove,
} = require("../controllers/user");

router.get("/secret", requireSignin, (req, res) => {
  res.json({
    user: "cheguei aqui",
  });
});

router.get("/users/:userId", requireSignin, isAdmin, listUsers);
router.get("/users/name/:userId", requireSignin, isAdmin, listUsersByName);
router.get("/user/dados/:userId", read);
router.put("/user/:userId", requireSignin, isAuth, update);
router.put("/user/dados/:userId", requireSignin, isAuth, updateDados);
router.put("/user/role/:userId", requireSignin, isAuth, updateRole);
router.put("/user/recuperar/:userId", updatePassword);
router.put("/user/aprovar/:userId", requireSignin, isAuth, updateAprovar);
router.delete(
  "/user/:userDelete/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  remove
);
router.get("/user/ativar/:userId", activateUserByEmail);
router.get("/user/:email", userByEmail);

router.param("userId", userById);

module.exports = router;
