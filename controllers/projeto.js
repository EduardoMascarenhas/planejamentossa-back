const Projeto = require("../models/projeto");
const Blog = require("../models/blog");
const formidable = require("formidable");
const slugify = require("slugify");
const { stripHtml } = require("string-strip-html");
const _ = require("lodash");
const { errorHandler } = require("../helpers/dbErrorHandler");
const fs = require("fs");
const { smartTrim } = require("../helpers/blog");

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Não foi possível fazer o upload da imagem",
      });
    }

    const { name, subTitle, body, eixo, selos } = fields;

    if (!name || !name.length) {
      return res.status(400).json({
        error: "É nescessário digitar um nome para o projeto",
      });
    }

    if (!body || body.length < 10) {
      return res.status(400).json({
        error: "Conteúdo do projeto é muito curto",
      });
    }
    if (!eixo) {
      return res.status(400).json({
        error: "É nescessário selecionar um eixo",
      });
    }

    let projeto = new Projeto();
    projeto.name = name;
    projeto.eixo = eixo;
    let arrayOfSelos = selos && selos.split(",");
    projeto.selos = arrayOfSelos;
    projeto.subTitle = subTitle;
    projeto.body = body;
    projeto.slug = slugify(name).toLowerCase();

    projeto.save((err, result) => {
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
  Projeto.find({}).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.read = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Projeto.findOne({ slug })
    .populate("eixo", "_id title slug")
    .populate("selos", "_id title")
    .exec((err, projeto) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(projeto);
    });
};

exports.remove = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Projeto.findOneAndRemove({ slug }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: "Projeto deleted successfully",
    });
  });
};

exports.update = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Projeto.findOne({ slug }).exec((err, oldProjeto) => {
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
      let slugBeforeMerge = oldProjeto.slug;
      oldProjeto = _.merge(oldProjeto, fields);
      oldProjeto.slug = slugBeforeMerge;

      const { name, subTitle, body, eixo, selos, categories } = fields;

      if (!oldProjeto.eixo && !eixo) {
        return res.status(400).json({
          error: "É nescessário ter pelomenos um eixo",
        });
      }
      if (body) {
        oldProjeto.excerpt = smartTrim(body, 320, " ", " ...");
        oldProjeto.desc = stripHtml(body.substring(0, 160));
      }
      if (selos) {
        oldProjeto.selos = selos.split(",");
      }

      oldProjeto.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        // result.photo = undefined;
        res.json(result);
      });
    });
  });
};
