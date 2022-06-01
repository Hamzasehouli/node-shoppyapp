const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const ErrorHandler = require("../providers/ErrorHandler.js");
const sendCookie = function (res, token) {
  res.cookie("jwt", token, {
    // secure: process.env.NODE_ENV === 'production' ? true : false,
    // httpOnly: true,
    // expires: 60 * 60 * 1000,
  });
};

exports.register = async function (req, res, next) {
  const obj = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  };

  const user = await User.create(obj);

  await jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.EXPIRES,
    },
    async (err, token) => {
      if (!token || err)
        return next(new ErrorHandler(400, "token has not been generated"));
      const obj = {
        to: user.email,
        subject: `Welcome ${user.firstName} to ${process.env.COMPANY}`,
        text: `Hellow ${user.firstName} to our famila, we are very glad that you have joind us, if you would have any question, feel free to ask us, we will be happy to answer`,
      };

      // res.cookie('jwt', token);
      sendCookie(res, token);
      res.status(201).json({
        status: "success",
        data: {
          user,
        },
      });
    }
  );
};

exports.login = async function (req, res, next) {
  const { email, password } = req.body;

  console.log("ddddddddddddddddddddddddddddddddd");

  if (!email) {
    return next(new ErrorHandler(400, "Please enter your email"));
  }
  if (!password) {
    return next(new ErrorHandler(400, "Please enter the password"));
  }

  const user = await User.findOne({ email: email }).select("+password");
  if (!user) {
    return next(
      new ErrorHandler(404, "No account found with the entered email")
    );
  }

  const isPasswordCorrect = await user.checkPassword(password, user.password);
  if (!isPasswordCorrect) {
    return next(
      new ErrorHandler(
        400,
        "Either the password incorret or the acocunt no longer exists"
      )
    );
  }
  await jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.EXPIRES,
    },
    (err, token) => {
      if (!token || err)
        return next(new ErrorHandler(400, "token has not been generated"));
      sendCookie(res, token);
      // res.cookie('jwt', token);
      res.status(200).json({
        status: "success",
        data: {
          user,
        },
      });
    }
  );
};
