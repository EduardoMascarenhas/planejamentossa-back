const Log = require("../models/log");
const User = require("../models/user");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.logById = (req, res, next, id) => {
  Log.findById(id).exec((err, log) => {
    if (err || !log) {
      return res.status(400).json({
        error: "Log não existe",
      });
    }
    req.log = log;
    next();
  });
};

exports.logsPaginated = (req, res, next) => {
  Log.find().exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};
    if (endIndex < data.length) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    results.results = data.slice(startIndex, endIndex);
    res.json(results);
    next();
  });
};

exports.create = (req, res) => {
  const log = new Log(req.body);
  log.userLog = req.body.userLog;
  log.userName = req.body.userName;
  log.acao = req.body.acao;
  log.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.read = (req, res) => {
  return res.json(req.log);
};

exports.remove = (req, res) => {
  console.log(req);
  Log.findOneAndRemove(req.log).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: "Log removido com sucesso!",
    });
  });
};

exports.list = (req, res) => {
  let order = req.query.order ? req.query.order : "desc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "createdAt";
  Log.find()
    .sort([[sortBy, order]])
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(data);
    });
};
