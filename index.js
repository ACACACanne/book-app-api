require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001
const path = require('path');
const booksRoutes = require('./routes/booksRoutes');

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





