const Blog = require("../models/blog");
const Category = require("../models/category");
const User = require("../models/user");
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

    const { title, subTitle, body, categories } = fields;
    if (!title || !title.length) {
      return res.status(400).json({
        error: "É nescessário digitar um título para o blog",
      });
    }

    if (!body || body.length < 50) {
      return res.status(400).json({
        error: "Conteúdo do blog é muito curto",
      });
    }

    if (!categories || categories.length === 0) {
      return res.status(400).json({
        error: "É necessário selecionar pelomenos uma categoria",
      });
    }
    console.log(categories);
    let blog = new Blog();
    blog.title = title;
    blog.subTitle = subTitle;
    blog.body = body;
    blog.excerpt = smartTrim(body, 100, " ", " ...");
    blog.slug = slugify(title).toLowerCase();
    blog.mtitle = `${title} | ${process.env.APP_NAME}`;
    blog.mdesc = stripHtml(body.substring(0, 160)).result;
    blog.postedBy = req.profile._id;
    // categories
    let arrayOfCategories = categories && categories.split(",");

    if (files.thumb) {
      if (files.thumb.size > 3000000) {
        return res.status(400).json({
          error: "Image should be less then 3mb in size",
        });
      }
      blog.thumb.data = fs.readFileSync(files.thumb.path);
      blog.thumb.contentType = files.thumb.type;
    }

    blog.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      // res.json(result);
      Blog.findByIdAndUpdate(
        result._id,
        { $push: { categories: arrayOfCategories } },
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
  let order = req.query.order ? req.query.order : "desc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "createdAt";

  Blog.find({})
    .sort([[sortBy, order]])
    .populate("categories", "_id name slug")
    .populate("postedBy", "_id name email")
    .select("_id title slug excerpt categories postedBy createdAt updatedAt")
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
  Blog.find({})
    .populate("categories", "_id name slug")
    .populate("postedBy", "_id name email")
    .skip(skip)
    .limit(limit)
    .select("_id title slug excerpt categories postedBy createdAt updatedAt")
    .exec((err, data) => {
      if (err) {
        return res.json({
          error: errorHandler(err),
        });
      }
      res.json(data);
    });
};

exports.listAllBlogsCategories = (req, res) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 10;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;

  let blogs;
  let categories;

  Blog.find({})
    .populate("categories", "_id name slug")
    .populate("postedBy", "_id name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select("_id title slug excerpt categories postedBy createdAt updatedAt")
    .exec((err, data) => {
      if (err) {
        return res.json({
          error: errorHandler(err),
        });
      }
      blogs = data; // blogs
      // get all categories
      Category.find({}).exec((err, c) => {
        if (err) {
          return res.json({
            error: errorHandler(err),
          });
        }
        categories = c; // categories
        res.json({ blogs, categories, size: blogs.length });
      });
    });
};

exports.read = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Blog.findOne({ slug })
    // .select("-photo")
    .populate("categories", "_id name slug")
    .populate("postedBy", "_id name email")
    .select(
      "_id title subTitle body slug mtitle mdesc categories postedBy createdAt updatedAt"
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
  Blog.findOneAndRemove({ slug }).exec((err, data) => {
    if (err) {
      return res.json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: "Blog deleted successfully",
    });
  });
};

exports.update = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Blog.findOne({ slug }).exec((err, oldBlog) => {
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
      let slugBeforeMerge = oldBlog.slug;
      oldBlog = _.merge(oldBlog, fields);
      oldBlog.slug = slugBeforeMerge;

      const { title, subTitle, body, categories } = fields;
      console.log(title, subTitle, body, categories);

      if (body) {
        oldBlog.excerpt = smartTrim(body, 320, " ", " ...");
        oldBlog.desc = stripHtml(body.substring(0, 160));
      }

      if (categories) {
        oldBlog.categories = categories.split(",");
      }

      if (files.thumb) {
        if (files.thumb.size > 10000000) {
          return res.status(400).json({
            error: "Image should be less then 1mb in size",
          });
        }
        oldBlog.thumb.data = fs.readFileSync(files.thumb.path);
        oldBlog.thumb.contentType = files.thumb.type;
      }

      oldBlog.save((err, result) => {
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
  Blog.findOne({ slug })
    .select("photo")
    .exec((err, blog) => {
      if (err || !blog) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.set("Content-Type", blog.photo.contentType);
      return res.send(blog.photo.data);
    });
};
exports.thumb = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Blog.findOne({ slug })
    .select("thumb")
    .exec((err, blog) => {
      if (err || !blog) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.set("Content-Type", blog.thumb.contentType);
      return res.send(blog.thumb.data);
    });
};

exports.listRelated = (req, res) => {
  // console.log(req.body.blog);
  let limit = req.body.limit ? parseInt(req.body.limit) : 3;
  const { _id, categories } = req.body.blog;

  Blog.find({ _id: { $ne: _id }, categories: { $in: categories } })
    .limit(limit)
    .sort({ createdAt: -1 })
    .select("title slug excerpt postedBy createdAt updatedAt")
    .exec((err, blogs) => {
      if (err) {
        return res.status(400).json({
          error: "Blogs not found",
        });
      }
      res.json(blogs);
    });
};

//
exports.listSearch = (req, res) => {
  console.log(req.query);
  const { search } = req.query;
  if (search) {
    Blog.find(
      {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { body: { $regex: search, $options: "i" } },
        ],
      },
      (err, blogs) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        res.json(blogs);
      }
    ).select("-photo -body");
  }
};
