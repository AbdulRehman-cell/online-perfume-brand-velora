const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://abdulrehmanishaque32:abdul8612233@cluster0.5uacgzw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

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