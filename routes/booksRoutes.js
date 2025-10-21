const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const { authenticateUser, requireAdmin } = require('../middleware');

// GET Public Books
router.get('/public', async (req, res) => {
  try {
    const books = await Book.find({ public: true, approved: true });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching public books' });
  }
});

// GET Personal Books
router.get('/my-books', authenticateUser, async (req, res) => {
  try {
    const books = await Book.find({ userId: req.user._id });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching your books' });
  }
});

//  POST Add Book
router.post('/', authenticateUser, async (req, res) => {
  try {
    const book = new Book({
      ...req.body,
      userId: req.user._id,
      approved: false
    });
    const saved = await book.save();
    res.status(201).json({ message: 'Book added', book: saved });
  } catch (err) {
    res.status(400).json({ message: 'Error adding book' });
  }
});

// PUT Edit Book
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    if (req.user.role !== 'admin' && book.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    Object.assign(book, req.body);
    const updated = await book.save();
    res.json({ message: 'Book updated', book: updated });
  } catch (err) {
    res.status(400).json({ message: 'Error updating book' });
  }
});

// DELETE Book (admin or owner)
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    if (req.user.role !== 'admin' && book.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await book.deleteOne();
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting book' });
  }
});

// DELETE Private Book (client only)
router.delete('/:id/private', authenticateUser, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book || book.userId.toString() !== req.user._id.toString() || book.public) {
      return res.status(403).json({ message: 'Unauthorized or not private' });
    }

    await book.deleteOne();
    res.json({ message: 'Private book deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting private book' });
  }
});

// PATCH Approve Book (admin only)
router.patch('/:id/approve', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    book.approved = true;
    await book.save();
    res.json({ message: 'Book approved' });
  } catch (err) {
    res.status(500).json({ message: 'Error approving book' });
  }
});

// PATCH Rating
router.patch('/:id/rating', authenticateUser, async (req, res) => {
  try {
    const { rating } = req.body;
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    book.rating = rating;
    await book.save();
    res.json({ message: 'Rating updated' });
  } catch (err) {
    res.status(400).json({ message: 'Error updating rating' });
  }
});

// PATCH Toggle Read Status
router.patch('/:id/readStatus', authenticateUser, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    book.read = !book.read;
    await book.save();
    res.json({ message: 'Read status toggled' });
  } catch (err) {
    res.status(500).json({ message: 'Error toggling read status' });
  }
});

module.exports = router;











