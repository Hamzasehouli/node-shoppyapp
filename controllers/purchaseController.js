const mongoose = require("mongoose");

const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_PRIVATE_KEY);

exports.createSession = async (req, res, next) => {
  try {
    const items = req.body.data;
    console.log(items);
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

    console.log(lineItems);
    // return;
    // 2)create session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: req.body.email,
      // client_reference_id: req.params.bookId,
      success_url: `${req.protocol}://${req.get("host")}/success`,
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
  const obj = {
    rating: req.body.rating,
    description: req.body.description,
    book: req.params.bookId,
    user: req.body.user,
  };
  const purchase = await Purchase.create(obj);
  res.status(201).json({
    status: "success",
    data: {
      purchase,
    },
  });
};
