const express = require("express");
const router = express.Router();
const multer = require("multer");
const { s3Upload } = require("../../utils/storage");

// Bring in Models & Helpers
const User = require("../../models/user");
const auth = require("../../middleware/auth");
const role = require("../../middleware/role");
const { ROLES } = require("../../constants");
const Document = require("../../models/document");
const { ObjectId } = require("mongoose");
// const storage = multer.memoryStorage();
// const upload = multer({ dest: 'uploads/' });
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/documents/");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.split(".");
    cb(null, name[0] + "-" + Date.now() + "." + name[1]);
  },
});

const upload = multer({ storage: storage });

// search users api
router.get("/search", auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const { search } = req.query;

    const regex = new RegExp(search, "i");

    const users = await User.find(
      {
        $or: [
          { firstName: { $regex: regex } },
          { lastName: { $regex: regex } },
          { email: { $regex: regex } },
        ],
      },
      { password: 0, _id: 0 }
    ).populate("merchant", "name");

    res.status(200).json({
      users,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

// fetch users api
router.get("/", auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const users = await User.find({}, { password: 0, _id: 0, googleId: 0 })
      .sort("-created")
      .populate("merchant", "name")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await User.countDocuments();

    res.status(200).json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      count,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    const user = req.user._id;
    const userDoc = await User.findById(user, { password: 0 }).populate({
      path: "merchant",
      model: "Merchant",
      populate: {
        path: "brand",
        model: "Brand",
      },
    });

    res.status(200).json({
      user: userDoc,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

router.put("/", auth, async (req, res) => {
  try {
    const user = req.user._id;
    const update = req.body.profile;
    const query = { _id: user };

    const userDoc = await User.findOneAndUpdate(query, update, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Your profile is successfully updated!",
      user: userDoc,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

router.post(
  "/uploadDocument",
  auth,
  upload.fields([
    { name: "cnic" },
    { name: "bs" },
    { name: "frb" },
    { name: "ntn" },
    { name: "wgc" },
    { name: "sl" },
  ]),
  async (req, res) => {
    try {
      const image = req.files;
      const user = req.user._id;
      const userDoc = await User.findById(user, { password: 0 });
      //const imageUrl = image;
      //const { imageUrl, imageKey } = await s3Upload(image);

      if (!userDoc.submitDocument) {
        const DocumentUpload = new Document({
          user: user,
          CNIC: req.files.cnic[0].filename,
          BS: req.files.bs[0].filename,
          FBR: req.files.frb[0].filename,
          NTN: req.files.ntn[0].filename,
          WGC: req.files.wgc[0].filename,
          SL: req.files.sl[0].filename,
          //documentFile: image,
          //documentKey: imageKey,
        });

        await DocumentUpload.save();
      }
      else {
        await Document.findOneAndUpdate({user: userDoc._id},{
          user: user,
          CNIC: req.files.cnic[0].filename,
          BS: req.files.bs[0].filename,
          FBR: req.files.frb[0].filename,
          NTN: req.files.ntn[0].filename,
          WGC: req.files.wgc[0].filename,
          SL: req.files.sl[0].filename,
        })
      }

      userDoc.submitDocument = true;
      const result = await userDoc.save();

      res.status(200).json({
        success: true,
        message: "Document is successfully updated!",
        user: result,
      });
    } catch (error) {
      res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }
  }
);

router.get("/DocumentVerify/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userDoc = await User.findById(id, { password: 0 });

    userDoc.verifyDocument = true;
    const result = await userDoc.save();
    res.status(200).json({
      success: true,
      message: "Document verify is successfully",
      user: result,
      
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again." + error,
    });
  }
});

router.get("/document", auth, async (req, res) => {
  try {
    const user = await Document.find().populate("user");
    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again." + error,
    });
  }
});

module.exports = router;
