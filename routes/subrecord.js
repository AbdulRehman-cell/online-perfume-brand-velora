const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://abdulrehmanishaque32:abdul8612233@cluster0.5uacgzw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

const emailSchema = new mongoose.Schema({
 
  email: {
    type: String,
    
  },
  name: {
    type: String,
    
  }
  ,
  subject: {
    type: String,
    
  }
  // Add any additional fields you need



});



module.exports = mongoose.model('subrecord', emailSchema);