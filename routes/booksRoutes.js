const express = require('express');
const router = express.Router();

// In-memory book data
let books = [];
let nextID = 1;

//get all the books
router.get('/books', (req, res) => {
    res.json(books);
});

//get a specific book by ID
router.get('/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const book = books.find(b => b.id === bookId);
    if (book) {
        res.json(book);
    } else {
        res.status(404).send('Book not found');
    }
});

//get books by author
router.get('/books/author/:author', (req, res) => {
    const author = req.params.author.toLowerCase();
    const filteredBooks = books.filter(b => b.author.toLowerCase() === author);
    res.json(filteredBooks);
});

//get books by title
router.get('/books/title/:title', (req, res) => {
    const title = req.params.title.toLowerCase();
    const filteredBooks = books.filter(b => b.title.toLowerCase().includes(title));
    res.json(filteredBooks);
}); 

// Add a new book
router.post('/books', (req, res) => {
    const newBook = req.body;
    books.push(newBook);
    res.status(201).json(newBook);
});     

// Update a book by ID
router.put('/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const updatedBook = req.body;
    books = books.map(book => book.id === bookId ? updatedBook : book);
    res.json(updatedBook);
});

// Delete a book by ID
router.delete('/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    books = books.filter(book => book.id !== bookId);
    res.status(204).send();
});     


module.exports = router;



