require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3002;
const path = require('path');
const booksRoutes = require('./routes/booksRoutes');

app.use('/api', booksRoutes);
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


app.get('/', (req, res) => {
    res.send('Welcome to the Book List!');
});


module.exports = app;




