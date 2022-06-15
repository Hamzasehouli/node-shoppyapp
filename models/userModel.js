const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      validate: {
        validator(val) {
          return val.length > 2;
        },
        message: "fail",
      },
    },
    email: {
      type: String,
      required: [true, "Please enter a valid email"],
      unique: true,
      validate: {
        validator(val) {
          return val.split("@")[1].includes(".") || val.includes("@");
        },
        message: "Please enter a valid email, valid email must containe @ ",
      },
    },
    password: {
      type: String,
      required: [
        true,
        "Please enter a valid password, it must containe at least 8 characters",
      ],
      select: false,
      validate: {
        validator(val) {
          return val > 8 || val < 20 || !val.includes(this.name);
        },
        message:
          "Please enter a valid password, password must contain min 8 and max 20 characters",
      },
    },
    confirmPassword: {
      type: String,
      required: [
        true,
        "Please confirm the password, it must containe at least 8 characters",
      ],
      validate: {
        validator(val) {
          return !val.includes(this.name) || this.password === val;
        },
        message:
          "Your password must not contain your neither your name nor your username",
      },
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },

    active: {
      type: Boolean,
      default: true,
    },
    resetPasswordToken: {
      type: String,
      required: false,
    },

    resetPasswordExpires: {
      type: Date,
      required: false,
    },
    passwordModifiedAt: {
      type: Date,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const lowercaseNames = function (prop) {
  return prop.toLowerCase()[0].toUpperCase() + prop.toLowerCase().slice(1);
};

userSchema.virtual("cart", {
  ref: "Cart",
  foreignField: "user",
  localField: "_id",
});

userSchema.pre("save", async function (next) {
  this.firstName = lowercaseNames(this.name);
  this.email = this.email.toLowerCase();
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  this.confirmPassword = undefined;

  next();
});

userSchema.methods.checkPassword = async function (
  plainPassword,
  encryptedPassword
) {
  return await bcrypt.compare(plainPassword, encryptedPassword);
};

userSchema.methods.generatePasswordReset = async function () {
  console.log("jjjjjjjjjjjjjjjjjjjjjjjjj");
  this.resetPasswordToken = await crypto.randomBytes(20).toString("hex");
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; //expires in an hour
  await this.save({ validateBeforeSave: false });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
