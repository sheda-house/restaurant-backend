// profileSettings.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const profileSettingsSchema = new Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  newsletter: {
    type: Boolean,
    default: false
  },
  theme: {
    type: String,
    enum: ['light', 'dark', 'blue'],
    default: 'light'
  }
});

const ProfileSettings = mongoose.model('ProfileSettings', profileSettingsSchema);

module.exports = ProfileSettings;
