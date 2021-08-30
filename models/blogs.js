const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const blogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      min: 3,
      max: 160,
    },
    body: {
      type: String,
      required: true,
      min: 200,
      max: 2000000,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    excerpt: {
      type: String,
      max: 1000,
    },
    mtitle: {
      type: String,
    },

    mdecs: {
      type: String,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    categories: [{ type: ObjectId, ref: "categories", required: true }],
    tags: [{ type: ObjectId, ref: "tags", required: true }],
    postedBy: {
      type: ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
