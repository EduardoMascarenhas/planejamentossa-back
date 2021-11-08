const Eixo = require("../models/eixo");
const Projeto = require("../models/projeto");
const User = require("../models/user");
const formidable = require("formidable");
const slugify = require("slugify");
const { stripHtml } = require("string-strip-html");
const _ = require("lodash");
const { errorHandler } = require("../helpers/dbErrorHandler");
const fs = require("fs");
const { smartTrim } = require("../helpers/eixo");

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Não foi possível fazer o upload da imagem",
      });
    }

    const { title, subTitle, vis, met, pro, borderColor, projetos } = fields;
    if (!title || !title.length) {
      return res.status(400).json({
        error: "É nescessário digitar um título para o eixo",
      });
    }

    if (!vis || vis.length < 10) {
      return res.status(400).json({
        error: "Conteúdo da visão é muito curto",
      });
    }
    if (!met || met.length < 10) {
      return res.status(400).json({
        error: "Conteúdo das metas é muito curto",
      });
    }
    if (!pro || pro.length < 10) {
      return res.status(400).json({
        error: "Conteúdo dos projetos é muito curto",
      });
    }

    if (!projetos || projetos.length === 0) {
      return res.status(400).json({
        error: "É necessário selecionar pelomenos um projeto",
      });
    }

    if (!borderColor) {
      return res.status(400).json({
        error: "É nescessário inserir o código da cor",
      });
    }
    let eixo = new Eixo();
    eixo.title = title;
    eixo.subTitle = subTitle;
    eixo.vis = vis;
    eixo.met = met;
    eixo.pro = pro;
    eixo.borderColor = borderColor;
    eixo.slug = slugify(title).toLowerCase();
    eixo.postedBy = req.profile._id;
    // projetos
    let arrayOfProjetos = projetos && projetos.split(",");

    if (files.thumb) {
      if (files.thumb.size > 3000000) {
        return res.status(400).json({
          error: "Image should be less then 3mb in size",
        });
      }
      eixo.thumb.data = fs.readFileSync(files.thumb.path);
      eixo.thumb.contentType = files.thumb.type;
    }

    eixo.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      // res.json(result);
      Eixo.findByIdAndUpdate(
        result._id,
        { $push: { projetos: arrayOfProjetos } },
        { new: true }
      ).exec((err, result) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        } else {
          res.json(result);
        }
      });
    });
  });
};

// list, read, remove, update

exports.list = (req, res) => {
  Eixo.find({})
    .populate("projetos", "_id name slug")
    .populate("postedBy", "_id name email")
    .select("_id title slug  borderColor projetos postedBy createdAt updatedAt")
    .exec((err, data) => {
      if (err) {
        return res.json({
          error: errorHandler(err),
        });
      }
      res.json(data);
    });
};
exports.listRecentes = (req, res) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 5;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;
  Eixo.find({})
    .populate("projetos", "_id name slug")
    .populate("postedBy", "_id name email")
    .skip(skip)
    .limit(limit)
    .select("_id title slug excerpt projetos postedBy createdAt updatedAt")
    .exec((err, data) => {
      if (err) {
        return res.json({
          error: errorHandler(err),
        });
      }
      res.json(data);
    });
};

exports.listAllEixosProjetos = (req, res) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 10;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;

  let eixos;
  let projetos;

  Eixo.find({})
    .populate("projetos", "_id name slug")
    .populate("postedBy", "_id name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select("_id title slug excerpt projetos postedBy createdAt updatedAt")
    .exec((err, data) => {
      if (err) {
        return res.json({
          error: errorHandler(err),
        });
      }
      eixos = data; // eixos
      // get all projetos
      Projeto.find({}).exec((err, c) => {
        if (err) {
          return res.json({
            error: errorHandler(err),
          });
        }
        projetos = c; // projetos
        res.json({ eixos, projetos, size: eixos.length });
      });
    });
};

exports.read = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Eixo.findOne({ slug })
    // .select("-photo")
    .populate("projetos", "_id name slug")
    .populate("postedBy", "_id name email")
    .select(
      "_id title subTitle vis met pro borderColor slug projetos postedBy createdAt updatedAt"
    )
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
  const slug = req.params.slug.toLowerCase();
  Eixo.findOneAndRemove({ slug }).exec((err, data) => {
    if (err) {
      return res.json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: "Eixo deleted successfully",
    });
  });
};

exports.update = (req, res) => {
  const slug = req.params.slug;

  Eixo.findOne({ slug }).exec((err, oldEixo) => {
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
      let slugBeforeMerge = oldEixo.slug;
      oldEixo = _.merge(oldEixo, fields);
      oldEixo.slug = slugBeforeMerge;

      const { title, subTitle, vis, met, pro, borderColor, projetos } = fields;

      if (projetos) {
        oldEixo.projetos = projetos.split(",");
      }

      if (files.thumb) {
        if (files.thumb.size > 10000000) {
          return res.status(400).json({
            error: "Imagem deve ter menos de 1mb de tamanho",
          });
        }
        oldEixo.thumb.data = fs.readFileSync(files.thumb.path);
        oldEixo.thumb.contentType = files.thumb.type;
      }

      oldEixo.save((err, result) => {
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

exports.photo = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Eixo.findOne({ slug })
    .select("photo")
    .exec((err, eixo) => {
      if (err || !eixo) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.set("Content-Type", eixo.photo.contentType);
      return res.send(eixo.photo.data);
    });
};
exports.thumb = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Eixo.findOne({ slug })
    .select("thumb")
    .exec((err, eixo) => {
      if (err || !eixo) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.set("Content-Type", eixo.thumb.contentType);
      return res.send(eixo.thumb.data);
    });
};

exports.listRelated = (req, res) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 3;
  const { _id, projetos } = req.body.eixo;

  Eixo.find({ _id: { $ne: _id }, projetos: { $in: projetos } })
    .limit(limit)
    .sort({ createdAt: -1 })
    .select("title slug excerpt postedBy createdAt updatedAt")
    .exec((err, eixos) => {
      if (err) {
        return res.status(400).json({
          error: "Eixos not found",
        });
      }
      res.json(eixos);
    });
};

//
exports.listSearch = (req, res) => {
  const { search } = req.query;
  if (search) {
    Eixo.find(
      {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { body: { $regex: search, $options: "i" } },
        ],
      },
      (err, eixos) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        res.json(eixos);
      }
    ).select("-photo -body");
  }
};
