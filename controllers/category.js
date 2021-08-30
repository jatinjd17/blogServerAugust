const { default: slugify } = require("slugify");
const Blog = require("../models/blogs");
const Category = require("../models/category");

exports.createCategory = async (req, res) => {
  const { name } = req.body;
  let slug = slugify(name).toLowerCase();
  const createCategory = new Category({
    name,
    slug,
  });
  createCategory
    .save()
    .then((createdcategory) => {
      res.status(200).json({ message: "category Created" });
    })
    .catch((e) => {
      res.status(400).json(e);
    });
};

exports.list = async (req, res) => {
  const allCategories = await Category.find({});

  if (!allCategories) {
    res.json("No categories Found");
  }
  res.status(200).json(allCategories);
};

exports.read = async (req, res) => {
  const slug = req.params.slug;
  // console.log(slug);
  try {
    const category = await Category.findById({ _id: slug }).select("_id name");
    // console.log(category);
    if (!category) {
      return res.json("No category found");
    }
    const blogs = await Blog.find({ categories: category })
      .populate("tags", "_id name slug")
      .populate("categories", "_id name slug")
      .select(
        "_id title slug excerpt categories tags postedBy createdAt updatedAt"
      );

    // if(!blogs){
    //     return res.json("no blog found");
    // }

    res.json({ category, blogs });
  } catch (e) {
    res.json(e);
  }
};

exports.remove = async (req, res) => {
  const slug = req.params.slug.toLowerCase();
  try {
    console.log(slug);
    const removeCat = await Category.findOneAndRemove({ slug: slug });
    console.log(removeCat);
    if (!removeCat) {
      res.json("No Category found");
    }
    res.json({ message: "Category Deleted" });
  } catch (e) {
    res.json(e);
  }
};
