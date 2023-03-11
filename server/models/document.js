const Mongoose = require('mongoose');
const { Schema } = Mongoose;

// Address Schema
const DocumentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  CNIC: {
    type: String
  },
  BS: {
    type: String
  },
  FBR: {
    type: String
  },
  NTN: {
    type: String
  },
  WGC: {
    type: String
  },
  SL: {
    type: String
  },
  documentKey: {
    type: String
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = Mongoose.model('document', DocumentSchema);
