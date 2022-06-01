const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const ErrorHandler = require("../providers/ErrorHandler.js");
const SendEmail = require("../providers/sendEmail");
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

exports.forgetPassword = async function (req, res, next) {
  const { email } = req.body;
  if (!email) {
    return next(new ErrorHandler(400, "Please enter your email to continue"));
  }

  const user = await User.findOne({ email: email }).select("+password");
  if (!user) {
    return next(new ErrorHandler(404, "No account found with this email"));
  }
  await user.generatePasswordReset();

  const url =
    process.env.NODE_ENV === "development"
      ? `${req.protocol}//${req.get("host")}/api/v1/users/resetPassword/${
          user.resetPasswordToken
        }`
      : `${req.protocol}//${req.get("host")}/resetPassword/${
          user.resetPasswordToken
        }`;

  const obj = {
    to: user.email,
    subject: `Please use the URL below to reset your password`,
    text: `The url is valid for 10 min : ${url}`,
  };

  try {
    await SendEmail(obj);

    res.status(200).json({
      status: "success",
      message: "The email is sent successfully",
    });
  } catch (err) {
    if (String(err.responseCode).startsWith("5")) {
      return next(
        new ErrorHandler(err.responseCode, "The email could not be sent")
      );
    }
  }
};

exports.resetPassword = async function (req, res, next) {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  // if (!currentPassword) {
  //   return next(new ErrorHandler(404, 'Please enter your current password'));
  // }
  if (!newPassword) {
    return next(new ErrorHandler(404, "Please enter your new password"));
  }
  if (!confirmNewPassword) {
    return next(
      new ErrorHandler(404, "Please confirm your new password password")
    );
  }

  if (confirmNewPassword !== newPassword) {
    return next(
      new ErrorHandler(
        404,
        "The new password and the confirmed one are not equal"
      )
    );
  }
  const user = await User.findOne({
    resetPasswordToken: req.params.resetToken,
    resetPasswordExpires: { $gt: Date.now() },
  }).select("+password");

  if (!user) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.save({ validateBeforeSave: false, validateModifiedOnly: false });
    return next(
      new ErrorHandler(404, "The url may have expired, pleae try again")
    );
  }

  // const passwordValidity = await user.checkPassword(
  //   currentPassword,
  //   user.password
  // );

  // if (!passwordValidity) {
  //   return next(
  //     new ErrorHandler(
  //       400,
  //       'The entered password is either incorrect or has been updated'
  //     )
  //   );
  // }

  user.password = newPassword;
  user.confirmPassword = confirmNewPassword;
  user.passwordModifiedAt = Date.now();
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save({ validateBeforeSave: false, validateModifiedOnly: false });
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
        message: "The password has been reset successfully",
      });
    }
  );
};
