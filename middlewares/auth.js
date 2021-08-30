const User = require("../models/user");

const jwt = require("jsonwebtoken");
const { response } = require("express");
const shortid = require("shortid");
const bcrypt = require("bcryptjs");
const expressJwt = require("express-jwt");

exports.signUp = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const isUser = await User.findOne({ email: email.toLowerCase() });

    if (isUser) {
      res.status(400).json({
        error: "Email is taken",
      });
    }
    let username = shortid.generate();
    let profile = `http://localhost:5000/profile/${username}`;
    let hashpassword = await bcrypt.hash(password, 12);
    const createuser = await User.create({
      name,
      email,
      profile,
      username,
      password: hashpassword,
    });

    res.status(201).json({ message: "Signup Success. Please Sign in" });
  } catch (e) {
    res.status(401).json({ message: "SomeThing went wrong" });
  }
};

exports.signIn = async (req, res) => {
  const { password } = req.body;

  try {
    const email1 = req.body.email;
    const isUser = await User.findOne({ email: email1.toLowerCase() });
    console.log(isUser);

    if (!isUser) {
      return res.status(401).json({ error: "No Email Found" });
    }

    const isPassword = await bcrypt.compare(password, isUser.password);

    if (!isPassword) {
      return res.status(401).json({ error: "inValid Credentials" });
    }

    const token = jwt.sign({ _id: isUser._id }, "secret", { expiresIn: "1d" });

    res.cookie("token", token, { expiresIn: "1d" });

    const { _id, username, name, email, role } = isUser;

    return res.json({ token, user: { _id, username, name, email, role } });
  } catch (e) {
    return res.json({ error: e });
  }
};

exports.signOut = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Signout success" });
};

exports.requireSignin = expressJwt({
  secret: "secret",
  algorithms: ["HS256"],
});

exports.authMiddleware = async (req, res, next) => {
  // console.log(req);
  const authuserId = req.user._id;
  const isAuth = await User.findById({ _id: authuserId });

  if (!isAuth) {
    return res.status(400).json({
      error: "User not found",
    });
  }
  req.profile = isAuth;
  next();
};

exports.adminMiddleware = async (req, res, next) => {
  const adminuserId = req.user._id;

  const isAdmin = await User.findById({ _id: adminuserId });
  if (!isAdmin) {
    return res.status(400).json({ error: "User not found" });
  }
  if (isAdmin.role !== 1) {
    return res.status(400).json({ error: "Admin resource Access denied" });
  }
  req.profile = isAdmin;
  next();
};
