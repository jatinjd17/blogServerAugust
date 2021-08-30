const Formidable = require("formidable");
const Blog = require("../models/blogs");
const User = require("../models/user");
const _ = require("lodash");
const fs = require("fs");

exports.read = (req, res) => {
  console.log(req);
  req.profile.password = undefined;
  return res.json(req.profile);
};

exports.publicProfile = async (req, res) => {
  let username = req.params.username;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.json("No user found");
    }
    let userId = user._id;

    const blogs = await Blog.find({ postedBy: userId });

    user.photo = undefined;
    user.password = undefined;

    res.json({ user, blogs });
  } catch (e) {
    res.json(e);
  }
};

exports.update = async (req, res) => {
  let form = new Formidable.IncomingForm();
  form.keepExtension = true;
  form.parse(req, (err, fields, files));
  let user = req.profile;
  user = _.extend(user, fileds);
  if (fields.password && fields.password.length < 6) {
    return res.json({
      error: "Password should be min 6 Characters",
    });
  }
  if (files.photo) {
    if (files.photo.size > 10000000) {
      return res.json({ error: "Image Should be less than 1mb" });
    }
    user.photo.data = fs.readFileSync(files.photo.path);
    user.photo.contentType = files.photo.type;
  }

  user
    .save()
    .then((updateduser) => {
      updateduser.password = undefined;
      updateduser.photo = undefined;
      res.json(updateduser);
    })
    .catch((e) => {
      res.json(e);
    });
};

exports.photo = async (req, res) => {
  const username = req.params.username;
  const isUser = await User.findOne({ username });
  if (!isUser) {
    res.json("no user found");
  }
  if (isUser.photo.data) {
    res.set("content-Type", isUser.photo.contentType);
    return res.send(isUser.photo.data);
  }
};

exports.userDetails = async (req, res) => {
  const username = req.params.username;
  const isUser = await User.findOne({ username });
  if (!isUser) {
    return res.json("no user found");
  } else {
    return res.json(isUser);
  }
};
