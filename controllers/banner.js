const Banner = require("../models/banner");
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

    const { title, subTitle, link } = fields;

    let banner = new Banner();
    banner.title = title;
    banner.subTitle = subTitle;
    banner.link = link;

    if (files.image) {
      if (files.image.size > 3000000) {
        return res.status(400).json({
          error: "Images should be less then 3mb in size",
        });
      }
      banner.image.data = fs.readFileSync(files.image.path);
      banner.image.contentType = files.image.type;
    }

    banner.save((err, result) => {
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

  Banner.find({})
    .sort([[sortBy, order]])
    .select("_id link createdAt updatedAt")
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
  const _id = req.params.bannerId;
  Banner.findOne({ _id })
    .select("_id link createdAt updatedAt")
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
  const _id = req.params.bannerId;

  Banner.findOneAndRemove({ _id }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: "Banner removido com sucesso!",
    });
  });
};

exports.update = (req, res) => {
  const _id = req.params.bannerId;

  Banner.findOne({ _id }).exec((err, oldBanner) => {
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
      let idBeforeMerge = oldBanner._id;
      oldBanner = _.merge(oldBanner, fields);
      oldBanner._id = idBeforeMerge;

      const { link, image } = fields;

      if (files.image) {
        if (files.image.size > 3000000) {
          return res.status(400).json({
            error: "Image should be less then 3mb in size",
          });
        }
        oldBanner.image.data = fs.readFileSync(files.image.path);
        oldBanner.image.contentType = files.image.type;
      }

      oldBanner.save((err, result) => {
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
  const _id = req.params.bannerId;
  Banner.findOne({ _id })
    .select("image")
    .exec((err, banner) => {
      if (err || !banner) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.set("Content-Type", banner.image.contentType);
      return res.send(banner.image.data);
    });
};
