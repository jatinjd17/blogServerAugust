const { default: slugify } = require("slugify");
const Blog = require("../models/blogs");
const Tag = require("../models/tag");

exports.createTag = async (req, res) => {
  const { name } = req.body;
  let slug = slugify(name).toLowerCase();
  const createTag = new Tag({
    name,
    slug,
  });
  createTag
    .save()
    .then((createdTag) => {
      res.status(200).json({ message: "Tag Created" });
    })
    .catch((e) => {
      res.status(400).json(e);
    });
};

exports.list = async (req, res) => {
  const alltags = await Tag.find({});
  if (!alltags) {
    res.json("No tags Found");
  }
  res.status(200).json(alltags);
};

exports.read = async (req, res) => {
  const slug = req.params.slug.toLowerCase();
  console.log(slug);
  try {
    const selectedTag = await Tag.findOne({ _id: slug }).select("name");
    if (!selectedTag) {
      return res.json("No Tag found");
    }
    console.log(selectedTag.name);
    const blogs = await Blog.find({ tags: selectedTag })
      .populate("tags", "_id name slug")
      .populate("categories", "_id name slug")
      .select(
        "_id title slug excerpt categories tags postedBy createdAt updatedAt"
      );
    console.log(blogs);

    // if(!blogs){
    //     return res.json("no blog found");
    // }

    res.json({ selectedTag, blogs });
  } catch (e) {
    res.json(e);
  }
};

exports.remove = async (req, res) => {
  const slug = req.params.slug.toLowerCase();
  try {
    const removeCat = await Tag.findOneAndRemove({ slug });
    if (!removeCat) {
      res.json("No Tag found");
    }
    res.json({ message: "Tag Deleted" });
  } catch (e) {
    res.json(e);
  }
};
