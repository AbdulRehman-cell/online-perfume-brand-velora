const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://abdulrehmanishaque32:abdul8612233@cluster0.5uacgzw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

const passkeyschema = new mongoose.Schema({
  password: String,
});

module.exports = mongoose.model('passkey', passkeyschema);