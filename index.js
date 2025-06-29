const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// const allowedOrigins = [
//   'http://localhost:5173',
//   'https://kirby-gaming-sy-frontend-dep6.vercel.app', 
// ];

// Middleware

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'https://kirby-gaming-sy-frontend-dep6.vercel.app'
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));


app.use(express.json());

// DB Connection
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => console.log('MongoDB connected'))
//   .catch(err => console.error(err));



const memberRoutes = require('./routes/members');
const Member = require('./models/Member'); // adjust the path if needed

app.use('/api/members', memberRoutes);

app.get("/api/test-db", async (req, res) => {
  try {
    const count = await Member.countDocuments();
    res.send({ count });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.get("/api/test-db-write", async (req, res) => {
  try {
    const testMember = new Member({
      username: "testuser",
      email: "testuser@example.com",
      
    });

    await testMember.save();

    res.status(201).send({
      message: "Test member saved successfully",
      member: testMember,
      title: "Eng",
      fieldOfStudy: "Engineering",
      phoneOrEmail: "0988296590",
      totalPurchaseAmountLastMonth: 5
      
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});


// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});
// Sample route
app.get('/api', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
  });
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


// connect to MongoDB and start the server only after successful connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ Connected to MongoDB");

  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err.message);
});
