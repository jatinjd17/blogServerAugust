const formidable = require("formidable");
const { smartTrim } = require("../helpers/smartTrim");
const Blog = require("../models/blogs");
const slugify = require("slugify");
const { stripHtml } = require("string-strip-html");
const fs = require("fs");

exports.createblog = async (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: "Image could not be found" });
    }

    const { title, body, categories, tags } = fields;

    if (!title || !title.length) {
      return res.status(400).json({ error: "Title is required" });
    }
    if (!body || !body.length) {
      return res.status(400).json({ error: "body is required" });
    }
    if (!categories || !categories.length) {
      return res.status(400).json({ error: "categories is required" });
    }
    if (!tags || !tags.length) {
      return res.status(400).json({ error: "tags is required" });
    }

    // let arrayofCategories = categories && categories.split(",");
    let arrayOfCategories = categories && categories.split(",");
    let arrayOfTags = tags && tags.split(",");
    console.log(arrayOfCategories);
    console.log(arrayOfTags);

    let photodata;
    let photocontent;

    if (files.photo) {
      if (files.photo.size > 10000000) {
        return res.status(400).json({
          error: "Image should be less then 1mb in size",
        });
      }
      photodata = fs.readFileSync(files.photo.path);
      photocontent = files.photo.type;
    }

    // let striph = stripHtml(body.substring(0, 160));

    let createBlog = new Blog();
    createBlog.title = title;
    createBlog.body = body;
    createBlog.excerpt = smartTrim(body, 320, " ", " ...");
    createBlog.slug = slugify(title).toLowerCase();
    createBlog.mtitle = smartTrim(title, 20, " ", " ...");
    //   mdecs: stripHtml(body.substring(0, 160)),
    createBlog.mdecs = smartTrim(body, 320, " ", " ...");
    createBlog.categories = arrayOfCategories;
    createBlog.tags = arrayOfTags;
    createBlog.photo.data = photodata;
    createBlog.photo.contentType = photocontent;
    createBlog.postedBy = req.user._id;

    console.log(createBlog);

    createBlog
      .save()
      .then((crearedblog) => {
        return res
          .status(200)
          .json({ message: "Blog is Posted", blog: crearedblog });
      })
      .catch((e) => {
        return res.status(400).json({ error: e });
      });
  });
};

// exports.list = async (req, res) => {
//   const allblog = await Blog.find({})
//     .populate("categories.name")
//     .populate("tags.name");

//   try {
//     return res.json(allblog);
//   } catch (e) {
//     return res.json(e);
//   }
// };

exports.list = (req, res) => {
  Blog.find({})
    .populate("categories", "_id name slug")
    .populate("tags", "_id name slug")
    .populate("postedBy", "_id name username")
    .select(
      "_id title slug excerpt categories tags postedBy createdAt updatedAt"
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

exports.read = async (req, res) => {
  const slug = req.params.slug.toLowerCase();

  const isBlog = await Blog.findOne({ slug })
    .populate("categories", "_id name slug")
    .populate("tags", "_id name slug")
    .populate("postedBy", "_id name username")
    .select(
      "_id title body slug excerpt mtitle mdesc categories tags postedBy createdAt updatedAt"
    );

  if (!isBlog) {
    return res.json({ error: "No Blog Found" });
  } else {
    return res.json(isBlog);
  }
};

exports.photo = async (req, res) => {
  const slug = req.params.slug.toLowerCase();
  // console.log(slug);
  const isBlog = await Blog.findOne({ slug }).select("photo");
  // console.log(isBlog);
  if (!isBlog) {
    return res.json({ error: "No Blog Found" });
  } else {
    res.set("Content-Type", isBlog.photo?.contentType);
    return res.send(isBlog.photo?.data);
  }
};

exports.delete1 = async (req, res) => {
  const slug = req.params.slug;
  let userprofile = req.profile;

  const isBlog = await Blog.findOne({ slug });
  // console.log(isBlog.postedBy.toString() == userprofile._id.toString());
  // console.log(userprofile.role == 1);
  // console.log(isBlog.postedBy);
  // console.log(userprofile._id);

  if (!isBlog) {
    return res.json({ error: "No blog found" });
  } else if (
    isBlog.postedBy.toString() == userprofile._id.toString() ||
    userprofile.role == 1
  ) {
    Blog.findOneAndRemove({ slug }).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        return res.json({ message: "Blog has been deleted Successfully" });
      }
    });
  } else {
    return res.json({ error: "No Admin user or Blog Owner" });
  }
};
