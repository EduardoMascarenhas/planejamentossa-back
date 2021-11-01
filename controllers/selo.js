const Selo = require("../models/selo");
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
        error: "Não foi possível fazer o upload da imagem",
      });
    }

    const { title, body } = fields;

    if (!title || !title.length) {
      return res.status(400).json({
        error: "É nescessário digitar um título para o selo",
      });
    }

    if (!body || body.length < 10) {
      return res.status(400).json({
        error: "Conteúdo do selo é muito curto",
      });
    }

    let selo = new Selo();
    selo.title = title;
    selo.body = body;

    if (files.image) {
      if (files.image.size > 3000000) {
        return res.status(400).json({
          error: "Images should be less then 3mb in size",
        });
      }
      selo.image.data = fs.readFileSync(files.image.path);
      selo.image.contentType = files.image.type;
    }

    selo.save((err, result) => {
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

  Selo.find({})
    .sort([[sortBy, order]])
    .select("_id title body createdAt updatedAt")
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
  const _id = req.params.seloId;
  Selo.findOne({ _id })
    .select("_id title body createdAt updatedAt")
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
  const _id = req.params.seloId;

  Selo.findOneAndRemove({ _id }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: "Selo removido com sucesso!",
    });
  });
};

exports.update = (req, res) => {
  const _id = req.params.seloId;

  Selo.findOne({ _id }).exec((err, oldSelo) => {
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
      let idBeforeMerge = oldSelo._id;
      oldSelo = _.merge(oldSelo, fields);
      oldSelo._id = idBeforeMerge;

      const { title, body } = fields;

      if (files.image) {
        if (files.image.size > 3000000) {
          return res.status(400).json({
            error: "Image should be less then 3mb in size",
          });
        }
        oldSelo.image.data = fs.readFileSync(files.image.path);
        oldSelo.image.contentType = files.image.type;
      }

      oldSelo.save((err, result) => {
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

exports.image = (req, res) => {
  const _id = req.params.seloId;
  Selo.findOne({ _id })
    .select("image")
    .exec((err, selo) => {
      if (err || !selo) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.set("Content-Type", selo.image.contentType);
      return res.send(selo.image.data);
    });
};
