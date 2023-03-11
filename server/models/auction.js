const mongoose = require("mongoose");
const types = mongoose.Types;

const auctionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    currentPrice: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      default: 300,
    },
    timer: {
      type: Number,
      default: 300,
    },
    soldAt: {
      type: Date,
    },
    imageUrl: {
      type: String,
    },
    brand: {
      type: types.ObjectId,
      ref: "Brand",
      default: null,
    },
    auctionStarted: {
      type: Boolean,
      default: true,
    },
    auctionEnded: {
      type: Boolean,
      default: false,
    },
    sold: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: types.ObjectId,
      ref: "user",
    },
    purchasedBy: {
      type: types.ObjectId,
      ref: "user",
    },
    currentBidder: {
      type: types.ObjectId,
      ref: "user",
    },
    bids: [
      {
        user: {
          type: types.ObjectId,
          ref: "user",
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        time: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("auction", auctionSchema);
