const mongoose = require("mongoose");
const Purchase = require("../models/purchaseModel");

const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_PRIVATE_KEY);

exports.createSession = async (req, res, next) => {
  try {
    const items = req.body.data;
    // 1) get book
    const lineItems = items.map((c) => {
      return {
        price_data: {
          currency: req.body.currency,
          product_data: {
            name: c.title
              .split("-")
              .map((l) => l.toUpperCase())
              .join(" "),
          },
          unit_amount: Number(c.price).toFixed() * 100,
        },
        quantity: 1,
        description: c.collection + " " + c.size,
      };
    });

    // return;
    // 2)create session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: req.body.email,
      // client_reference_id: req.params.bookId,
      success_url: `https://shoppyapp-backend.herokuapp.com/api/v1/success`,
      cancel_url: `${req.protocol}://${req.get("host")}/fail`,
    });
    res.status(200).json({
      status: "success",
      session,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.createPurchase = async function (req, res, next) {
  const obj = req.body;

  const data = obj.data.map((o) => {
    return {
      email: obj.email,
      image: o.imageUrl,
      title: o.title,
      size: o.size,
      currency: obj.currency,
      price: Number(o.discountPrice) || Number(o.price),
    };
  });

  const purchase = await Purchase.create(data);
  res.status(201).json({
    status: "success",
    data: {
      purchase,
    },
  });
};
exports.getPurchases = async function (req, res, next) {
  const email = req.params.email;

  const purchases = await Purchase.find({ email });

  res.status(200).json({
    status: "success",
    data: {
      purchases,
    },
  });
};
