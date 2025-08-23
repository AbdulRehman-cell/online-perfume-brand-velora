require('dotenv').config();
const mongoose = require("mongoose");

mongoose.connect( process.env.MONGODB_URI);

const productSchema = new mongoose.Schema({
  title: String,
  details: String,
  price: Number,
  image: String ,
  notes:String,// this will be the filename of uploaded image
});

module.exports = mongoose.model('products', productSchema);