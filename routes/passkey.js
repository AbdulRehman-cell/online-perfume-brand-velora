require('dotenv').config();
const mongoose = require("mongoose");

mongoose.connect( process.env.MONGODB_URI);
const passkeyschema = new mongoose.Schema({
  password: String,
});

module.exports = mongoose.model('passkey', passkeyschema);