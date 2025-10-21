const Book = require('../models/book');

// Public books (approved by admin)
async function getPublicBooks(req, res) {
  try {
    const books = await Book.find({ public: true, approved: true });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching public books' });
  }
}

// Personal books (owned by user)
async function getUserBooks(req, res) {
  try {
    const books = await Book.find({ userId: req.user._id });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user books' });
  }
}

// View specific book (if public or owned)
async function getBookById(req, res) {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const isOwner = book.userId?.equals(req.user._id);
    const isPublic = book.public && book.approved;

    if (!isOwner && !isPublic && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching book' });
  }
}

// Add book (starts private)
async function addBook(req, res) {
  try {
    const newBook = new Book({
      ...req.body,
      userId: req.user._id,
      public: false,
      approved: false
    });
    await newBook.save();
    res.status(201).json({ message: 'Book submitted for review', book: newBook });
  } catch (err) {
    res.status(500).json({ message: 'Error adding book' });
  }
}

// Admin approves book
async function approveBook(req, res) {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    book.public = true;
    book.approved = true;
    await book.save();

    res.json({ message: 'Book approved for public listing', book });
  } catch (err) {
    res.status(500).json({ message: 'Error approving book' });
  }
}

// Admin updates public book
async function updateBook(req, res) {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).json({ message: 'Book not found' });

    res.json({ message: 'Book updated', book });
  } catch (err) {
    res.status(500).json({ message: 'Error updating book' });
  }
}

// Admin deletes public book
async function deleteBook(req, res) {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    await book.deleteOne();
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting book' });
  }
}

// User deletes their own private book
async function deletePrivateBook(req, res) {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    if (!book.userId.equals(req.user._id)) {
      return res.status(403).json({ message: 'You can only delete your own books' });
    }

    if (book.public) {
      return res.status(403).json({ message: 'Cannot delete public books' });
    }

    await book.deleteOne();
    res.json({ message: 'Private book deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting private book' });
  }
}

// Update rating
async function updateBookRating(req, res) {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    book.rating = Math.max(0, Math.min(req.body.rating, 5));
    await book.save();

    res.json({ message: 'Rating updated', rating: book.rating });
  } catch (err) {
    res.status(500).json({ message: 'Error updating rating' });
  }
}

// Toggle read status
async function updateBookReadStatus(req, res) {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    book.read = !book.read;
    await book.save();

    res.json({ message: 'Read status updated', read: book.read });
  } catch (err) {
    res.status(500).json({ message: 'Error updating read status' });
  }
}

module.exports = {
  getPublicBooks,
  getUserBooks,
  getBookById,
  addBook,
  approveBook,
  updateBook,
  deleteBook,
  deletePrivateBook,
  updateBookRating,
  updateBookReadStatus
};




