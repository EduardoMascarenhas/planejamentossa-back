const express = require("express");
const router = express.Router();

const {
  novoCadastro,
  novaInscricao,
  recuperarSenha,
} = require("../controllers/email");

router.post("/novo-cadastro/enviar", novoCadastro);
router.post("/nova-inscricao/enviar", novaInscricao);
router.post("/user/recuperar/:userId/:email", recuperarSenha);

module.exports = router;
