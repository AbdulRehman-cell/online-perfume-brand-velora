require('dotenv').config();
const mongoose = require("mongoose");

mongoose.connect( process.env.MONGODB_URI);

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