const express = require("express");
const router = express.Router();
const multer = require("multer");
const Mongoose = require("mongoose");
const moment = require("moment");
// Bring in Models & Utils
const Product = require("../../models/product");
const Tender = require("../../models/tender");
const Brand = require("../../models/brand");
const Category = require("../../models/category");
const auth = require("../../middleware/auth");
const role = require("../../middleware/role");
const checkAuth = require("../../utils/auth");
const { s3Upload } = require("../../utils/storage");

const {
  getStoreProductsQuery,
  getStoreProductsWishListQuery,
  getStoreAuctionsQuery,
} = require("../../utils/queries");
const { ROLES } = require("../../constants");

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images/");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.split(".");
    cb(null, name[0] + "-" + Date.now() + "." + name[1]);
  },
});

const upload = multer({ storage: storage });

// fetch product slug api
router.get("/item/:slug", async (req, res) => {
  try {
    const name = req.params.slug;

    const productDoc = await Tender.findOne({ name });
    //const startDate = moment(productDoc.createdAt, "YYYY-MM-DD HH:mm:ss");
   // const today = moment();
   // const daysSinceStart = today.diff(startDate, "days");
 // var result;
 //   if(daysSinceStart >= productDoc.duration) {
 //     productDoc.tenderEnded = true;
 //     result = await productDoc.save();
 //   }

   // const hasNoBrand =
    //  productDoc?.brand === null || productDoc?.brand?.isActive === false;

    if (!productDoc) {
      return res.status(404).json({
        message: "No product found.",
      });
    }

    res.status(200).json({
      product: productDoc,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

// fetch product name search api
router.get("/list/search/:name", async (req, res) => {
  try {
    const name = req.params.name;

    const productDoc = await Tender.find(
      { name: { $regex: new RegExp(name), $options: "is" }, isActive: true },
      { name: 1, slug: 1, imageUrl: 1, price: 1, _id: 0 }
    );

    if (productDoc.length < 0) {
      return res.status(404).json({
        message: "No product found.",
      });
    }

    res.status(200).json({
      products: productDoc,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

// fetch store products by advanced filters api
router.get("/list", async (req, res) => {
  try {
    let {
      sortOrder,
      rating,
      max,
      min,
      category,
      page = 1,
      limit = 10,
    } = req.query;
    sortOrder = JSON.parse(sortOrder);

    const categoryFilter = category ? { category } : {};
    const basicQuery = getStoreAuctionsQuery(1, 999999999999, 0);

    //const userDoc = await checkAuth(req);
    // const categoryDoc = await Category.findOne(
    //   { slug: categoryFilter.category, isActive: true },
    //   "products -_id"
    // );

    // if (categoryDoc && categoryFilter !== category) {
    //   basicQuery.push({
    //     $match: {
    //       isActive: true,
    //       _id: {
    //         $in: Array.from(categoryDoc.products),
    //       },
    //     },
    //   });
    // }

    let products = null;
    const productsCount = await Tender.find({});
    const count = productsCount.length;
    const size = count > limit ? page - 1 : 0;
    const currentPage = count > limit ? Number(page) : 1;

    // paginate query
    const paginateQuery = [
      { $sort: sortOrder },
      { $skip: size * limit },
      { $limit: limit * 1 },
    ];

    // if (userDoc) {
    //   const wishListQuery = getStoreProductsWishListQuery(userDoc.id).concat(
    //     basicQuery
    //   );
    //   products = await Tender.aggregate(wishListQuery.concat(paginateQuery));
    // } else {
    //   products = await Tender.aggregate(basicQuery.concat(paginateQuery));
    // }

    products = await Tender.aggregate(paginateQuery);

    res.status(200).json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage,
      count,
    });
  } catch (error) {
    console.log("error", error);
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

// fetch store products by brand api
router.get("/list/brand/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;

    const brand = await Brand.findOne({ slug, isActive: true });

    if (!brand) {
      return res.status(404).json({
        message: `Cannot find brand with the slug: ${slug}.`,
      });
    }

    const userDoc = await checkAuth(req);

    if (userDoc) {
      const products = await Tender.aggregate([
        {
          $match: {
            isActive: true,
            brand: brand._id,
          },
        },
        {
          $lookup: {
            from: "wishlists",
            let: { product: "$_id" },
            pipeline: [
              {
                $match: {
                  $and: [
                    { $expr: { $eq: ["$$product", "$product"] } },
                    { user: new Mongoose.Types.ObjectId(userDoc.id) },
                  ],
                },
              },
            ],
            as: "isLiked",
          },
        },
        {
          $lookup: {
            from: "brands",
            localField: "brand",
            foreignField: "_id",
            as: "brands",
          },
        },
        {
          $addFields: {
            isLiked: { $arrayElemAt: ["$isLiked.isLiked", 0] },
          },
        },
        {
          $unwind: "$brands",
        },
        {
          $addFields: {
            "brand.name": "$brands.name",
            "brand._id": "$brands._id",
            "brand.isActive": "$brands.isActive",
          },
        },
        { $project: { brands: 0 } },
      ]);

      res.status(200).json({
        products: products.reverse().slice(0, 8),
        page: 1,
        pages: products.length > 0 ? Math.ceil(products.length / 8) : 0,
        totalProducts: products.length,
      });
    } else {
      const products = await Tender.find({
        brand: brand._id,
        isActive: true,
      }).populate("brand", "name");

      res.status(200).json({
        products: products.reverse().slice(0, 8),
        page: 1,
        pages: products.length > 0 ? Math.ceil(products.length / 8) : 0,
        totalProducts: products.length,
      });
    }
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

router.get("/list/select", auth, async (req, res) => {
  try {
    const products = await Tender.find({}, "name");

    res.status(200).json({
      products,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

// add product api
router.post(
  "/add",
  auth,
  upload.single("image"),
  async (req, res) => {
    try {
      const owner = req.user._id
      const name = req.body.name;
      const description = req.body.description;
      const endingDate = req.body.endingDate;
      const startingDate = req.body.startingDate;
      const price = req.body.price;
      
      const currentPrice = req.body.price;
      const image = req.file.filename;

      if (!description || !name) {
        return res
          .status(400)
          .json({ error: "You must enter description & name." });
      }

      if (!endingDate) {
        return res.status(400).json({ error: "You must enter a ending date." });
      }
      if (!startingDate) {
        return res.status(400).json({ error: "You must enter a starting date." });
      }

      if (!price) {
        return res.status(400).json({ error: "You must enter a price." });
      }

      const foundProduct = await Tender.findOne({ name });

      if (foundProduct) {
        return res.status(400).json({ error: "This name is already in use." });
      }

      const imageUrl = image;

      //const { imageUrl, imageKey } = await s3Upload(image);

      const product = new Tender({
        name,
        description,
        price,
        currentPrice,
        startingDate,
        endingDate,
        owner,
        imageUrl,
        //imageKey
      });

      const savedProduct = await product.save();

      res.status(200).json({
        success: true,
        message: `Aution has been added successfully!`,
        product: savedProduct,
      });
    } catch (error) {
      return res.status(400).json({
        error: "Your request could not be processed. Please try again." + error,
      });
    }
  }
);

// fetch products api
router.get(
  "/",
  auth,
  async (req, res) => {
    try {
      let products = [];

      if (req.user.merchant) {
        const brands = await Brand.find({
          merchant: req.user.merchant,
        }).populate("merchant", "_id");

        const brandId = brands[0]?.["_id"];

        products = await Tender.find({})
          .populate({
            path: "brand",
            populate: {
              path: "merchant",
              model: "Merchant",
            },
          })
          .where("brand", brandId);
      } else {
        products = await Tender.find({}).populate({
          path: "brand",
          populate: {
            path: "merchant",
            model: "Merchant",
          },
        });
      }

      res.status(200).json({
        products,
      });
    } catch (error) {
      res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }
  }
);

// fetch product api
router.get(
  "/:id",
  auth,
  async (req, res) => {
    try {
      const productId = req.params.id;

      let productDoc = null;

      if (req.user.merchant) {
        const brands = await Brand.find({
          merchant: req.user.merchant,
        }).populate("merchant", "_id");

        const brandId = brands[0]["_id"];

        productDoc = await Tender.findOne({ _id: productId })
          .populate({
            path: "brand",
            select: "name",
          })
          .where("brand", brandId);
      } else {
        productDoc = await Tender.findOne({ _id: productId }).populate({
          path: "brand",
          select: "name",
        });
      }

      if (!productDoc) {
        return res.status(404).json({
          message: "No product found.",
        });
      }

      res.status(200).json({
        product: productDoc,
      });
    } catch (error) {
      res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }
  }
);

router.put(
  "/:id",
  auth,
  async (req, res) => {
    try {
      const productId = req.params.id;
      const update = req.body.product;
      const query = { _id: productId };
      const { sku, slug } = req.body.product;

      const foundProduct = await Tender.findOne({
        $or: [{ slug }, { sku }],
      });

      if (foundProduct && foundProduct._id != productId) {
        return res
          .status(400)
          .json({ error: "Sku or slug is already in use." });
      }

      await Tender.findOneAndUpdate(query, update, {
        new: true,
      });

      res.status(200).json({
        success: true,
        message: "Tender has been updated successfully!",
      });
    } catch (error) {
      res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }
  }
);

router.put(
  "/:id/active",
  auth,
  role.check(ROLES.Admin, ROLES.Merchant),
  async (req, res) => {
    try {
      const productId = req.params.id;
      const update = req.body.product;
      const query = { _id: productId };

      await Tender.findOneAndUpdate(query, update, {
        new: true,
      });

      res.status(200).json({
        success: true,
        message: "Tender has been updated successfully!",
      });
    } catch (error) {
      res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }
  }
);

router.delete(
  "/delete/:id",
  auth,
  async (req, res) => {
    try {
      const product = await Tender.deleteOne({ _id: req.params.id });

      res.status(200).json({
        success: true,
        message: `Tender has been deleted successfully!`,
        product,
      });
    } catch (error) {
      res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }
  }
);

router.post("/bid/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  try {
    const ad = await Tender.findById(id);
    if (!ad) return res.status(404).json({ errors: [{ msg: "Ad not found" }] });
    // Check bid validity
    if (parseFloat(ad.currentPrice) >= parseFloat(amount)) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Bid amount less than existing price" }] });
    }
    if (ad.sold || ad.tenderEnded || !ad.tenderStarted) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Tender has ended or has not started" }] });
    }
    ad.bids.push({ user: req.user.id, amount: amount });
    ad.currentPrice = amount;
    ad.currentBidder = req.user.id;
    const savedAd = await ad.save();
    res.status(200).json({
      success: true,
      message: `Aution bid added successfully!`,
      product: savedAd,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: [{ msg: error }] });
  }
});

module.exports = router;
