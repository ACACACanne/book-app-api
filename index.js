require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001
const path = require('path');
const booksRoutes = require('./routes/booksRoutes');
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err)); 
  

app.use(express.json()); // ✅ First, parse incoming JSON
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', booksRoutes);



app.get('/', (req, res) => {
  console.log('Root route accessed');
  res.send('Welcome to the Book List!');
});


app.use(express.json()); // ✅ First, parse incoming JSON
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', booksRoutes);



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});





