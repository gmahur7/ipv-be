const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{10}$/, 'Please enter a valid phone number']
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  pincode: {
    type: String,
    required: true,
    match: [/^\d{6}$/, 'Please enter a valid pincode']
  },
  district: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  zone: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  shareInfo:{
    points:{
      type:Number,
      default:0,
    },
    code:{
      type:String,
      required:true,
    },
    clicks:{
      type:Number,
      default:0,
    },
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
