const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://abdulrehmanishaque32:abdul8612233@cluster0.5uacgzw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

const productSchema = new mongoose.Schema({
  title: String,
  details: String,
  price: Number,
  image: String ,
  notes:String,// this will be the filename of uploaded image
});

module.exports = mongoose.model('products', productSchema);