require("dotenv").config();
var express = require('express');
var nodemailer = require("nodemailer");
var Product = require("./products");
var Article = require("./articles");
var upload = require("./multer");
var passkey = require("./passkey");
const orders = require('./orders');
const cloudinary = require('cloudinary').v2;
var router = express.Router();
const session = require("express-session");



// login page
router.get("/login", (req, res) => {
  res.render("login", { error: null });
});

// handle login form
router.post("/login", async (req, res) => {
  const { password } = req.body;

  try {
    const passDoc = process.env.PASS;

    if (password  === passDoc) {
      req.session.isAdmin = true;  // ✅ save admin login in session
      res.redirect("/admin");
    } else {
      res.render("login", { error: "Invalid password" });
    }
  } catch (err) {
    console.error(err);
    res.render("login", { error: "Server error" });
  }
});

// protect /admin
function adminAuth(req, res, next) {
  if (req.session.isAdmin) {
    return next();
  }
  res.redirect("/login");
}

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    const articles = await Article.find();
    res.render("index", { products, articles, sent: 2 });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.post('/contact', async function (req, res) {
  const { name, email, message } = req.body;
  let nameu = req.body.name;
  const products = await Product.find();
  const articles = await Article.find();

  let emailsub = await emailmodel.create({ email: req.body.email });

  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // App password
    },
  });

  // Email options
  const mailOptions = {
    from: 'velorabyhk@gmail.com',
    to: email,
    subject: 'Thanks for Reaching Out – Velora by HK ',
    html: `
      <p style="font-family: 'Georgia', serif; font-size: 16px; color: #4A4A4A;">
  Hi <strong style="color: #000;">${name}</strong>,
</p>

<p style="font-family: 'Georgia', serif; font-size: 15px; color: #555;">
  Thank you for connecting with <strong>Velora by HK</strong> — where fragrance is redefined.  
  We’ve received your message:
</p>

<blockquote style="border-left: 4px solid #D4AF37; padding-left: 10px; margin: 10px 0; font-style: italic; color: #444;">
  ${message}
</blockquote>

<p style="font-family: 'Georgia', serif; font-size: 15px; color: #555;">
  Our team will review your inquiry and respond with care as soon as possible.
</p>

<br>

<p style="font-family: 'Georgia', serif; font-size: 15px; color: #000;">
  Warm regards, <br>
  <strong>Customer Care Team</strong> <br>
  Velora by HK <br>
  <span style="font-size: 13px; color: #777;">Fragrance Redefined</span>
  <br>
  
  p>If there is any other query,</p>
        <a href="https://wa.me/923107175839" target="_blank">
  <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
       alt="WhatsApp" width="24" height="24" style="vertical-align:middle; border:none;">
</a>
  
  
</p>

    `,

  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    res.render('index', { sent: 0, name: nameu, products, articles }); // Redirect to homepage or thank-you page
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Something went wrong.');
  }
});




router.get('/admin', adminAuth, async (req, res) => {

  const users = await orders.find();
  const products = await Product.find();
  const articles = await Article.find();


  res.render('admin', { products, users, searched: 0, articles, admin: 9 });

});




router.post('/admin', async (req, res) => {

  let id = req.body.id;

  const products = await Product.find();
  const articles = await Article.find();

  try {
    const userf = await orders.findOne({ id: id });

    if (!userf) {
      // ❌ No match found
      res.render('admin', { userf, searched: 1, products, articles, admin: 9 });
    }

    // ✅ Match found
    else {
      res.render('admin', { userf, searched: 2, products, articles, admin: 9 });
    }

  } catch (err) {
    res.render('admin', { userf, searched: 1, products, articles, admin: 9 });
  }
});





router.post('/add', upload.single('image'), async (req, res) => {
  const { title, details, price, category, notes } = req.body;
  
   

   const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "products",
    });

  const newProduct = new Product({ title, details, price, image:result.secure_url, notes });
  await newProduct.save();

  res.redirect('/');
});





router.post('/delete', async (req, res) => {

  const delp = req.body.title;
  await Product.findOneAndDelete({ title: delp });
 


  res.redirect("/");


});



router.post('/addarticle', upload.single('image'), async (req, res) => {
  const { header, shortdescription, time, longdescription } = req.body;
  const image = req.file.filename;

  const newArticle = new Article({ header, shortdescription, time, image, longdescription });
  await newArticle.save();


   res.redirect("/");
});





router.post('/deletearticle', async (req, res) => {

  const delp = req.body.header;
  await Article.findOneAndDelete({ header: delp });


  res.redirect("/");


});



router.get('/article/:id', async (req, res) => {
  try {
    const articles = await Article.findById(req.params.id); // ✅ Correct method
    if (!articles) {
      return res.status(404).send("Article not found");
    }
    res.render('articles', { articles });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching article");
  }
});

router.get('/order/:id', async (req, res) => {

  const order = await Product.findById(req.params.id);
  try {
    // ✅ Correct method
    if (!order) {
      return res.status(404).send("order not found");
    }
    res.render("display", { order });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching order");
  }

});


router.post("/order/:id", upload.single('proof'), async (req, res) => {

  const orderm = await Product.findById(req.params.id);


  const { name, email, phone, address, quantity } = req.body;
  const proof = req.file.filename;

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "proofs",
    });



  let orderrecord = await orders.create({
    email: req.body.email,
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address,
    quantity: req.body.quantity,
    proof:result.secure_url,
    price: orderm.price,
    title: orderm.title,
    status: "processing",
  });


  let cookieOrders = req.cookies.orders ? JSON.parse(req.cookies.orders) : [];

  // 🔹 push the new order
  cookieOrders.push({
    id: orderrecord._id,
    title: orderrecord.title,
    price: orderrecord.price,
    quantity: orderrecord.quantity,
    status: "processing",
    date: new Date().toLocaleDateString()
  });

  res.cookie("orders", JSON.stringify(cookieOrders), { maxAge: 5 * 24 * 60 * 60 * 1000 });

  try {

    res.render("details", { price: orderm.price, title: orderm.title, quantity: quantity, admin: 9, proof: result.secure_url
      , name: name, email: email, phone: phone, address: address });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching order");
  }

});


router.get('/viewdetails/:id', async (req, res) => {


  try {
    const order = await orders.findById(req.params.id); // ✅ Correct method
    if (!order) {
      return res.send("order not found");
    }
    res.render("details", { order: order, admin: 4 });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching order");
  }

});



router.get('/details/:id', async (req, res) => {


  try {
    const order = await orders.findById(req.params.id); // ✅ Correct method
    if (!order) {
      return res.send("order not found");
    }
    res.render("details", { order: order, admin: 3 });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching order");
  }

});

router.get("/deldetail/:id", async (req, res) => {

  try {
    await orders.findByIdAndDelete(req.params.id);
    res.redirect("/admin");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting order");
  }



});

router.get("/record", (req, res) => {

  let cookieOrders = req.cookies.orders ? JSON.parse(req.cookies.orders) : [];



  res.render("record", { orders: cookieOrders },);
});

router.get("/privacy", (req, res) => {
  res.render("privacy");
});

router.get("/terms", (req, res) => {
  res.render("terms");
});


router.get("/confirmation/:id", async (req, res) => {

  const order = await orders.findById(req.params.id);
  order.status = "confirmed";   // or "Pending", "Processing", etc.
  await order.save();

  let cookieOrders = req.cookies.orders ? JSON.parse(req.cookies.orders) : [];
  const orderId = req.params.id;

  let orderi = cookieOrders.find(o => o.id === orderId);
  if (orderi) {
    orderi.status = "Confirmed";  // update field
  }

  res.cookie("orders", JSON.stringify(cookieOrders), { httpOnly: true });


  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,// App password
    },
  });

  // Email options
  const mailOptions = {
    from: 'velorabyhk@gmail.com',
    to: `${order.email}`,
    subject: 'Thanks for Reaching Out – Velora by HK ',
    html: `<!DOCTYPE html>
      <html>
      <body>
        <h2>Hello ${order.name},</h2>
        <p>Thank you for your purchase! Your order details:</p>
        <p><b>Product:</b> Velora — Fresh & Clean</p>
        <p><b>Price:</b> PKR ${order.price}</p>
        <p><b>Quantity:</b> ${order.quantity}</p>
        <p><b>Total Amount:</b> PKR ${order.quantity * order.price}.00</p>
        <p><b>Shipping Address:</b> ${order.address}</p>
        <br>
       
        <p>If there is any other query,</p>
        <a href="https://wa.me/923107175839" target="_blank">
  <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
       alt="WhatsApp" width="24" height="24" style="vertical-align:middle; border:none;">
</a>
      </body>
      </html>`,

  };
  await transporter.sendMail(mailOptions);

  res.redirect("/admin");



});


router.get("/inquiry/:id", async (req, res) => {

  const order = await orders.findById(req.params.id);


  order.status = "inquiring";   // or "Pending", "Processing", etc.
  await order.save();


  let cookieOrders = req.cookies.orders ? JSON.parse(req.cookies.orders) : [];
  const orderId = req.params.id;

  let orderi = cookieOrders.find(o => o.id === orderId);
  if (order) {
    order.status = "Inquiring";  // update field
  }

  res.cookie("orders", JSON.stringify(cookieOrders), { httpOnly: true });




  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // App password
    },
  });

  // Email options
  const mailOptions = {
    from: 'velorabyhk@gmail.com',
    to: `${order.email}`,
    subject: 'Thanks for Reaching Out – Velora by HK ',
    html: `<html>
  <body>
    <h2>Hello ${order.name},</h2>
    <p>We truly appreciate your purchase with <b>Velora</b>. Your order details are as follows:</p>
    
    <p><b>Product:</b> Velora — Fresh & Clean</p>
    <p><b>Price:</b> PKR ${order.price}</p>
    <p><b>Quantity:</b> ${order.quantity}</p>
    <p><b>Total Amount:</b> PKR ${order.quantity * order.price}.00</p>
    <p><b>Shipping Address:</b> ${order.address}</p>
    
    <br>
    
    <p>We have received your payment submission; however, the provided proof of payment is not fully clear.</p>
    <p>To proceed with confirming and shipping your order, we kindly request you to share a clearer image or screenshot of your payment receipt.</p>
    
    <p>You may reply directly to this email with the updated proof of payment.</p>
    
    <br>
    
    p>If there is any other query,</p>
        <a href="https://wa.me/923107175839" target="_blank">
  <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
       alt="WhatsApp" width="24" height="24" style="vertical-align:middle; border:none;">
</a>
    <br>
    <p>Thank you for choosing Velora. We look forward to completing your order!</p>
  </body>
</html>`,

  };
  await transporter.sendMail(mailOptions);

  res.redirect("/admin");


});





module.exports = router;
