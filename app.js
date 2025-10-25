//app.js

require('dotenv').config();

const express = require('express');
const app = express();

//Tell Express to trust Render's reverse proxy
app.set("trust proxy", 1);

const connectDB = require('./config/db');
const path = require("path");
const http = require('http');

//const server = http.createServer(app);


// NEW: security libs
const cors = require("cors");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const sanitize = require('mongo-sanitize');
const xss = require('xss-clean');

const authRoutes = require('./routes/authRoutes');
const verifyRoutes = require('./routes/verifyRoutes');
const reportRoutes = require('./routes/reportRoutes');
const awarenessRoutes = require('./routes/awarenessRoutes');
const profileImageRoutes = require('./routes/profileImageRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const statsRoutes = require("./routes/statsRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const chatUploadRoutes = require("./routes/chatUpload");


//DB connection
connectDB();

// Security hardening
//helmet
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "https://cdn.jsdelivr.net",
        "https://cdn.socket.io",   // allow socket.io CDN
        "'unsafe-eval'",   //  needed for tesseract.js
      ],
      workerSrc: ["'self'", "blob:"],
      childSrc: ["'self'", "blob:"],
      connectSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://cdn.jsdelivr.net",   // ✅ allow worker importScripts
        "https://cdn.socket.io",
        "http://localhost:5000",
        "https://fake-drug-verification.onrender.com",
        "https://res.cloudinary.com"
      ],
      imgSrc: [
        "'self'", 
        "data:", 
        "blob:", 
        "http://localhost:5000", 
        "https://fake-drug-verification.onrender.com", 
        "https://res.cloudinary.com"
      ], // 👈 FIX: allow blob: images
    },
  })
);




//mongoSanitize
app.use((req, res, next) => {
  if (req.body) req.body = sanitize(req.body);
  if (req.params) req.params = sanitize(req.params);
  if (req.query) req.query = sanitize(req.query);
  next();
});


// xss
app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    for (let key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = xss(req.body[key]);
      }
    }
  }

  if (req.params && typeof req.params === 'object') {
    for (let key in req.params) {
      if (typeof req.params[key] === 'string') {
        req.params[key] = xss(req.params[key]);
      }
    }
  }

  next();   // ✅ important to call next
});

  //ratelimit
const limiter = rateLimit({ 
windowMs: 15 * 60 * 1000, // 15 minutes 
max: 100, // max 100 requests per IP 
message: 'Too many requests from this IP, please try again later.' 
}); 
app.use('/api', limiter);



// CORS configuration
const allowedOrigins = [
  //'http://localhost:5000',   // If frontend serves on 5000
  //'null', //To allow frontend guys to work freely for now
  'https://fake-drug-verification.onrender.com', //deployed backend 
  //'https://medcheck-website.netlify.app'  // deployed frontend  
  
  ]; 

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));



//Middleware to parse JSON
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Serve static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


//to work from vercel frontend i will have to comment this static out
app.use(express.static(path.join(__dirname, "frontfront"))); // serve frontend static



// Init socket.io chat
//initChat(server);


//Routes
app.use('/api/auth', authRoutes);
app.use('/api', verifyRoutes);
app.use('/api', reportRoutes);
app.use('/api', awarenessRoutes);
app.use('/api', profileImageRoutes);
app.use('/api', dashboardRoutes);
app.use("/api", statsRoutes);
app.use("/api", feedbackRoutes);
app.use("/api", chatUploadRoutes);

module.exports = app;