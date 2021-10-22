const User = require("../models/user");

const { errorHandler } = require("../helpers/dbErrorHandler");

exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "Usuário não encontrado",
      });
    }
    req.profile = user;
    next();
  });
};

exports.activateUserByEmail = (req, res) => {
  const { userId } = req.params;
  User.findOne({ _id: userId }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "Usuário não encontrado",
      });
    }
    if (user.email === req.params.email) {
      console.log("cheguei aki, user: " + user);
    }

    user.ativo = true;

    user.save((err, updatedUser) => {
      if (err) {
        console.log("ERRO AO ATUALIZAR USUARIO", err);
        return res.status(400).json({
          error: "Falha ao tentar atualizar o usuário",
        });
      }
      updatedUser.hashed_password = undefined;
      updatedUser.salt = undefined;
      res.redirect("https://portaldoestagiariofsa.com.br/entrar");
    });
  });
};

exports.userByEmail = (req, res) => {
  const { email } = req.params;
  User.findOne({ email: email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "Usuário não encontrado",
      });
    }
    res.json(user);
  });
};

exports.read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

exports.updateAprovar = (req, res) => {
  const { aprovar, _id } = req.body;
  console.log(aprovar, _id);
  User.findOne({ _id: _id }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "Usuário não encontrado",
      });
    }

    user.aprovado = aprovar;

    user.save((err, updatedUser) => {
      if (err) {
        console.log("ERRO AO ATUALIZAR USUARIO", err);
        return res.status(400).json({
          error: "Falha ao tentar atualizar o usuário",
        });
      }
      updatedUser.hashed_password = undefined;
      updatedUser.salt = undefined;
      res.json(updatedUser);
    });
  });
};

exports.updatePassword = (req, res) => {
  const { password, _id } = req.body;
  User.findOne({ _id: _id }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "Usuário não encontrado",
      });
    }

    user.password = password;

    user.save((err, updatedUser) => {
      if (err) {
        console.log("ERRO AO ATUALIZAR USUARIO", err);
        return res.status(400).json({
          error: "Falha ao tentar atualizar o usuário",
        });
      }
      updatedUser.hashed_password = undefined;
      updatedUser.salt = undefined;
      res.json(updatedUser);
    });
  });
};
exports.updateRole = (req, res) => {
  const { role, _id } = req.body;

  User.findOne({ _id: _id }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "Usuário não encontrado",
      });
    }

    user.role = role;

    user.save((err, updatedUser) => {
      if (err) {
        console.log("ERRO AO ATUALIZAR USUARIO", err);
        return res.status(400).json({
          error: "Falha ao tentar atualizar o usuário",
        });
      }
      updatedUser.hashed_password = undefined;
      updatedUser.salt = undefined;
      res.json(updatedUser);
    });
  });
};
exports.updateDados = (req, res) => {
  const {
    checkTermos,
    declara50,
    checkEnsinoBolsa,
    checkEnsinoMedio,
    checkDeficiencia,
    checkModalidade,
    checkCad,
    nisAluno,
    nomeResp,
    cpfResp,
    nisResp,
    sexo,
    estadoCivil,
    cpf,
    rg,
    orgaoExp,
    dataNasc,
    corRaca,
    municipio,
    cep,
    bairro,
    logradouro,
    numeroCasa,
    complemento,
    telefoneFixo,
    celular,
    tipoEnsino,
    universidade,
    campus,
    municipioCampus,
    curso,
    anoIngresso,
    turno,
  } = req.body;

  User.findOne({ _id: req.profile._id }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "Usuário não encontrado",
      });
    }

    user.checkCad = checkCad;
    user.checkTermos = checkTermos;
    user.declara50 = declara50;
    user.checkEnsinoBolsa = checkEnsinoBolsa;
    user.checkEnsinoMedio = checkEnsinoMedio;
    user.checkDeficiencia = checkDeficiencia;
    user.checkModalidade = checkModalidade;
    user.nisAluno = nisAluno;
    user.nomeResp = nomeResp;
    user.cpfResp = cpfResp;
    user.nisResp = nisResp;
    user.sexo = sexo;
    user.estadoCivil = estadoCivil;
    user.cpf = cpf;
    user.rg = rg;
    user.orgaoExp = orgaoExp;
    user.corRaca = corRaca;
    user.municipio = municipio;
    user.cep = cep;
    user.bairro = bairro;
    user.logradouro = logradouro;
    user.numeroCasa = numeroCasa;
    user.complemento = complemento;
    user.telefoneFixo = telefoneFixo;
    user.celular = celular;
    user.tipoEnsino = tipoEnsino;
    user.universidade = universidade;
    user.campus = campus;
    user.municipioCampus = municipioCampus;
    user.curso = curso;
    user.turno = turno;
    user.anoIngresso = anoIngresso;
    user.dataNasc = dataNasc;
    user.save((err, updatedUser) => {
      if (err) {
        console.log("ERRO AO ATUALIZAR USUARIO", err);
        return res.status(400).json({
          error: "Falha ao tentar atualizar o usuário",
        });
      }
      updatedUser.hashed_password = undefined;
      updatedUser.salt = undefined;
      res.json(updatedUser);
    });
  });
};
exports.update = (req, res) => {
  // console.log('UPDATE USER - req.user', req.user, 'UPDATE DATA', req.body);
  const { name, password, role } = req.body;

  User.findOne({ _id: req.profile._id }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "Usuário não encontrado",
      });
    }
    if (!name) {
      return res.status(400).json({
        error: "É necessário digitar o nome",
      });
    } else {
      user.name = name;
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          error: "Senha deve ter no mínimo 6 caracteres",
        });
      } else {
        user.password = password;
      }
    }
    user.role = role;

    user.save((err, updatedUser) => {
      if (err) {
        console.log("ERRO AO ATUALIZAR USUARIO", err);
        return res.status(400).json({
          error: "Falha ao tentar atualizar o usuário",
        });
      }
      updatedUser.hashed_password = undefined;
      updatedUser.salt = undefined;
      res.json(updatedUser);
    });
  });
};

exports.listUsers = (req, res) => {
  let order = req.query.order ? req.query.order : "desc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "role";

  User.find()
    .sort([[sortBy, order]])
    .exec((err, users) => {
      if (err) {
        return res.status(400).json({
          error: "Usuários não encontrados",
        });
      }
      res.json(users);
    });
};

exports.listUsersByName = (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "name";

  User.find()
    .sort([[sortBy, order]])
    .exec((err, users) => {
      if (err) {
        return res.status(400).json({
          error: "Usuários não encontrados",
        });
      }
      res.json(users);
    });
};

exports.remove = (req, res) => {
  const { userDelete, userId } = req.params;
  const _id = userDelete.toString();
  User.findOneAndRemove({ _id }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: "Usuário removido com sucesso!",
    });
  });
};
