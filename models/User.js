const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  googleId: {
    type: String
  },
  bodyConstitution: {
    balanced: { type: Number, default: 0 },
    yangDeficient: { type: Number, default: 0 },
    yinDeficient: { type: Number, default: 0 },
    qiDeficient: { type: Number, default: 0 },
    phlegmDamp: { type: Number, default: 0 },
    dampHeat: { type: Number, default: 0 },
    stagnantBlood: { type: Number, default: 0 },
    stagnantQi: { type: Number, default: 0 },
    inheritedSpecial: { type: Number, default: 0 },
    testDate: { type: Date }
  }
});

module.exports = mongoose.model('User', UserSchema);