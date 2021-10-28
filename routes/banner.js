const express = require("express");
const router = express.Router();
const {
  create,
  image,
  list,
  read,
  remove,
  update,
} = require("../controllers/banner");

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.post("/banner/criar/:userId", requireSignin, isAuth, isAdmin, create);
router.get("/banners", list);
router.get("/banner/:bannerId", read);
router.delete(
  "/banner/:bannerId/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  remove
);
router.put("/banner/:userId/:bannerId", requireSignin, isAuth, isAdmin, update);
router.get("/banner/image/:bannerId", image);

router.param("userId", userById);
module.exports = router;
