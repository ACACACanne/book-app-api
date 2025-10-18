const express = require('express');
const {
  getAllBooks,
  getBookById,
  getBooksByAuthor,
  getBooksByTitle,
  getBooksByGenre,
  getBooksByPublishedYear,
  getBooksByRating,
  addBook,
  updateBook,
  deleteBook,
  updateBookRating,
  updateBookReadStatus
} = require('../controllers/booksController');

const router = express.Router();

router.get('/books', getAllBooks);
router.get('/books/:id', getBookById);
router.get('/books/author/:author', getBooksByAuthor);
router.get('/books/title/:title', getBooksByTitle);
router.get('/books/genre/:genre', getBooksByGenre);
router.get('/books/publishedYear/:year', getBooksByPublishedYear);
router.get('/books/rating/:rating', getBooksByRating);
router.post('/books', addBook);
router.put('/books/:id', updateBook);
router.delete('/books/:id', deleteBook);
router.patch('/books/:id/rating', updateBookRating);
router.patch('/books/:id/readStatus', updateBookReadStatus);

module.exports = router;





