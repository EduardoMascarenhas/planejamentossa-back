const express = require('express');
const router = express.Router();
const {
    create,
    list,
    listRecentes,
    read,
    remove,
    update,
    thumb,
    listRelated,
    listSearch,
} = require('../controllers/eixo');

const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.post('/eixo/criar/:userId',  requireSignin, isAuth, isAdmin, create);
router.get('/eixos', list);
router.get('/eixos/recentes', listRecentes);
router.get('/eixo/:slug', read);
router.delete('/eixo/:slug/:userId', requireSignin, isAuth, isAdmin, remove);
router.put('/eixo/:userId/:slug', requireSignin, isAuth,isAdmin, update);
router.get('/eixo/thumb/:slug', thumb);
router.post('/eixos/relacionados', listRelated);
router.get('/eixos/search', listSearch);

router.param('userId', userById);
module.exports = router;
