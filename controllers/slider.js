const Slider = require("../models/slider");
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

    const { link, image } = fields;

    let slider = new Slider();
    slider.link = link;

    if (files.image) {
      if (files.image.size > 3000000) {
        return res.status(400).json({
          error: "Images should be less then 3mb in size",
        });
      }
      slider.image.data = fs.readFileSync(files.image.path);
      slider.image.contentType = files.image.type;
    }

    slider.save((err, result) => {
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
  let order = req.query.order ? req.query.order : "desc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "createdAt";

  Slider.find({})
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
  const _id = req.params._id;
  Slider.findOne({ _id })
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
  let slider = req.slider;
  slider.remove((err) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: "Slider removido com sucesso!",
    });
  });
};

exports.update = (req, res) => {
  const _id = req.params._id;

  Slider.findOne({ _id }).exec((err, oldSlider) => {
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
      let idBeforeMerge = oldSlider._id;
      oldSlider = _.merge(oldSlider, fields);
      oldSlider._id = idBeforeMerge;

      const { link, image } = fields;

      if (files.image) {
        if (files.image.size > 3000000) {
          return res.status(400).json({
            error: "Image should be less then 3mb in size",
          });
        }
        oldSlider.image.data = fs.readFileSync(files.image.path);
        oldSlider.image.contentType = files.image.type;
      }

      oldSlider.save((err, result) => {
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
  const _id = req.params._id;
  Slider.findOne({ _id })
    .select("image")
    .exec((err, slider) => {
      if (err || !slider) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.set("Content-Type", slider.image.contentType);
      return res.send(slider.image.data);
    });
};
