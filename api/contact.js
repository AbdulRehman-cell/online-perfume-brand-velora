import nodemailer from "nodemailer";
import Product from "../routes/products";
import Article from "../routes/articles";
// import your email model if needed

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { name, email, message } = req.body;

  // If you use a DB, connect here (e.g., mongoose.connect...)

  // Save email if needed
  // await emailmodel.create({ email });

  // Fetch products/articles if you need to return them
  // const products = await Product.find();
  // const articles = await Article.find();

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
        <p>If there is any other query,</p>
        <a href="https://wa.me/923107175839" target="_blank">
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
               alt="WhatsApp" width="24" height="24" style="vertical-align:middle; border:none;">
        </a>
      </p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ sent: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: "Something went wrong." });
  }
}