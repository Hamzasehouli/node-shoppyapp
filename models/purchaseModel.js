const mongoose = require("mongoose");

const purchaseModel = mongoose.Schema({
  email: {
    type: String,
  },
  image: {
    type: String,
  },
  title: {
    type: String,
  },
  size: {
    type: String,
  },
  currency: {
    type: String,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  price: {
    type: Number,
  },
  added_at: {
    type: Date,
    default: Date.now(),
  },
});

const Purchase = mongoose.model("Purchase", purchaseModel);

module.exports = Purchase;
