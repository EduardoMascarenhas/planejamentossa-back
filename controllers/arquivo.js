const Arquivo = require("../models/arquivo");
const formidable = require("formidable");
const { stripHtml } = require("string-strip-html");
const _ = require("lodash");
const { errorHandler } = require("../helpers/dbErrorHandler");
const fs = require("fs");

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Não foi possível fazer o upload da arquivom",
      });
    }

    let arquivo = new Arquivo();

    if (files.arquivo) {
      arquivo.arquivo.data = fs.readFileSync(files.arquivo.path);
      arquivo.arquivo.contentType = files.arquivo.type;
    }

    arquivo.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(result);
    });
  });
};

exports.list = (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "createdAt";

  Arquivo.find({})
    .sort([[sortBy, order]])
    .select("_id createdAt updatedAt")
    .exec((err, data) => {
      if (err) {
        return res.json({
          error: errorHandler(err),
        });
      }
      res.json(data);
    });
};

exports.read = (req, res) => {
  const _id = req.params.arquivoId;
  Arquivo.findOne({ _id })
    .select("_id createdAt updatedAt")
    .exec((err, data) => {
      if (err) {
        return res.json({
          error: errorHandler(err),
        });
      }
      res.json(data);
    });
};

exports.remove = (req, res) => {
  const _id = req.params.arquivoId;

  Arquivo.findOneAndRemove({ _id }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: "Arquivo removido com sucesso!",
    });
  });
};

exports.update = (req, res) => {
  const _id = req.params.arquivoId;

  Arquivo.findOne({ _id }).exec((err, oldArquivo) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: "Image could not upload",
        });
      }
      let idBeforeMerge = oldArquivo._id;
      oldArquivo = _.merge(oldArquivo, fields);
      oldArquivo._id = idBeforeMerge;

      const { arquivo } = fields;

      if (files.arquivo) {
        oldArquivo.arquivo.data = fs.readFileSync(files.arquivo.path);
        oldArquivo.arquivo.contentType = files.arquivo.type;
      }

      oldArquivo.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        res.json(result);
      });
    });
  });
};

exports.arquivo = (req, res) => {
  const _id = req.params.arquivoId;
  Arquivo.findOne({ _id })
    .select("arquivo")
    .exec((err, arquivo) => {
      if (err || !arquivo) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.set("Content-Type", arquivo.arquivo.contentType);
      return res.send(arquivo.arquivo.data);
    });
};
