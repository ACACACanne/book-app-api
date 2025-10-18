const express = require('express');
const { getAllBooks, getBookById, getBooksByAuthor, getBooksByTitle, addBook, updateBook, deleteBook } = require('../controllers/booksController');
const router = express.Router();

// In-memory book data
let books = [];
let nextID = 1;

//get all the books
router.get('/books', getAllBooks);

//get a specific book by ID
router.get('/books/:id', getBookById);

//get books by author
router.get('/books/author/:author', getBooksByAuthor);

//get books by title
router.get('/books/title/:title', getBooksByTitle);

// Add a new book
router.post('/books', addBook);

// Update a book by ID
router.put('/books/:id', updateBook);

// Delete a book by ID
router.delete('/books/:id', deleteBook);


module.exports = router;



