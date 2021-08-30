const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const blogRoutes = require("./routes/blogs");
const categoryRoutes = require("./routes/category.js");
const tagRoutes = require("./routes/tag.js");
const userRoutes = require("./routes/user.js");

const app = express();

app.use(bodyParser.json());

app.use(cors());

app.use("/api", authRoutes);
app.use("/api", blogRoutes);
app.use("/api", categoryRoutes);
app.use("/api", tagRoutes);
app.use("/api", userRoutes);
// mongodb://localhost:27017/JatinBlogAugust
mongoose
  .connect(
    "mongodb+srv://jatin:jatin123@cluster0.1zrdh.mongodb.net/jatin?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      // useFindAndModify: false,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("DB is connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log("Server is Connected on port 5000");
    });
  })
  .catch((e) => {
    console.log(e);
  });
