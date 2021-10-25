const express = require('express');
const router = express.Router();
const { create, list, read, remove } = require('../controllers/category');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.post('/categoria/criar/:userId', requireSignin, isAuth, isAdmin, create);
router.get('/categorias', list);
router.get('/categoria/:slug', read);
router.delete('/categoria/:slug/:userId', requireSignin, isAuth, isAdmin, remove);

router.param('userId', userById);
module.exports = router;
