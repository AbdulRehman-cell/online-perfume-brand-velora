const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://abdulrehmanishaque32:abdul8612233@cluster0.5uacgzw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

const articleSchema = new mongoose.Schema({
 
  image:{
   type:String,

  }
  ,

  header: {
    type: String,
  },
  shortdescription: {
    type: String,
  }
  ,
  time: {
    type: Number,    
  }
  ,
  longdescription: {
   type:String,

  }

  // Add any additional fields you need
});



module.exports = mongoose.model('article', articleSchema);