const Carta = require("../models/carta");
const User = require("../models/user");
const formidable = require("formidable");
const slugify = require("slugify");
const { stripHtml } = require("string-strip-html");
const _ = require("lodash");
const { errorHandler } = require("../helpers/dbErrorHandler");
const fs = require("fs");
const { smartTrim } = require("../helpers/carta");

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Não foi possível fazer o upload da imagem",
      });
    }

    const { title, subTitle, body } = fields;
    if (!title || !title.length) {
      return res.status(400).json({
        error: "É nescessário digitar um título para o carta",
      });
    }

    if (!body || body.length < 10) {
      return res.status(400).json({
        error: "Conteúdo do carta é muito curto",
      });
    }

    let carta = new Carta();
    carta.title = title;
    carta.subTitle = subTitle;
    carta.body = body;
    carta.excerpt = smartTrim(body, 100, " ", " ...");
    carta.slug = slugify(title).toLowerCase();
    carta.mtitle = `${title} | ${process.env.APP_NAME}`;
    carta.mdesc = stripHtml(body.substring(0, 160)).result;
    carta.postedBy = req.profile._id;

    if (files.thumb) {
      if (files.thumb.size > 3000000) {
        return res.status(400).json({
          error: "Image should be less then 3mb in size",
        });
      }
      carta.thumb.data = fs.readFileSync(files.thumb.path);
      carta.thumb.contentType = files.thumb.type;
    }

    carta.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(result);
    });
  });
};

// list, read, remove, update

exports.list = (req, res) => {
  let order = req.query.order ? req.query.order : "desc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "createdAt";

  Carta.find({})
    .sort([[sortBy, order]])
    .populate("postedBy", "_id name email")
    .select("_id title slug excerpt postedBy createdAt updatedAt")
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
  Carta.find({})
    .populate("postedBy", "_id name email")
    .skip(skip)
    .limit(limit)
    .select("_id title slug excerpt postedBy createdAt updatedAt")
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
  const slug = req.params.slug.toLowerCase();
  Carta.findOne({ slug })
    // .select("-photo")
    .populate("postedBy", "_id name email")
    .select(
      "_id title subTitle body slug mtitle mdesc postedBy createdAt updatedAt"
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
  Carta.findOneAndRemove({ slug }).exec((err, data) => {
    if (err) {
      return res.json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: "Carta deleted successfully",
    });
  });
};

exports.update = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Carta.findOne({ slug }).exec((err, oldCarta) => {
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
      let slugBeforeMerge = oldCarta.slug;
      oldCarta = _.merge(oldCarta, fields);
      oldCarta.slug = slugBeforeMerge;

      const { title, subTitle, body } = fields;
      console.log(title, subTitle, body);

      if (body) {
        oldCarta.excerpt = smartTrim(body, 320, " ", " ...");
        oldCarta.desc = stripHtml(body.substring(0, 160));
      }

      if (files.thumb) {
        if (files.thumb.size > 10000000) {
          return res.status(400).json({
            error: "Image should be less then 1mb in size",
          });
        }
        oldCarta.thumb.data = fs.readFileSync(files.thumb.path);
        oldCarta.thumb.contentType = files.thumb.type;
      }

      oldCarta.save((err, result) => {
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
  Carta.findOne({ slug })
    .select("photo")
    .exec((err, carta) => {
      if (err || !carta) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.set("Content-Type", carta.photo.contentType);
      return res.send(carta.photo.data);
    });
};
exports.thumb = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Carta.findOne({ slug })
    .select("thumb")
    .exec((err, carta) => {
      if (err || !carta) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.set("Content-Type", carta.thumb.contentType);
      return res.send(carta.thumb.data);
    });
};

//
exports.listSearch = (req, res) => {
  console.log(req.query);
  const { search } = req.query;
  if (search) {
    Carta.find(
      {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { body: { $regex: search, $options: "i" } },
        ],
      },
      (err, cartas) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        res.json(cartas);
      }
    ).select("-photo -body");
  }
};
