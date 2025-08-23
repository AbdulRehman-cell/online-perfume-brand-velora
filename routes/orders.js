require('dotenv').config();
const mongoose = require("mongoose");

mongoose.connect( process.env.MONGODB_URI);

const orderSchema = new mongoose.Schema({
 
  name: {
    type: String,
    
  },
  email: {
    type: String,
    
  }
  ,
  phone: {
    type: String,
    
  }
  ,
  address: {
    type: String,
    
  }
  ,
  quantity: {
    type: Number,
    
  }
 ,
  proof:{

 type:String

  }
  ,price:{

    type:Number
  }
  ,
  title:{

    type:String
  }
  ,
  status:{

    type:String,

  }
  // Add any additional fields you need



});



module.exports = mongoose.model('orders', orderSchema);