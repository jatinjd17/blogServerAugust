const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const tagSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      max: 32,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("tags", tagSchema);
