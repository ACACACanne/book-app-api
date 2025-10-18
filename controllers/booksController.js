const Book = require('../models/Book');

// In-memory book data for testing purposes only  

let books = [
  { id: 1, title: '1984', author: 'George Orwell', read: true },
  { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', read: false },
];

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();  
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    book ? res.json(book) : res.status(404).send('Book not found');
  } catch (error) {
    console.error('Error fetching book by ID:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getBooksByAuthor = async (req, res) => {
  try {
    const author = req.params.author.toLowerCase();
    const filtered = await Book.find({ author }).exec();
    res.json(filtered);
  } catch (error) {
    console.error('Error fetching books by author:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getBooksByTitle = async (req, res) => {
  try {
    const title = req.params.title.toLowerCase();
    const filtered = await Book.find({ title: { $regex: title, $options: 'i' } }).exec();
    res.json(filtered);
  } catch (error) {
    console.error('Error fetching books by title:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.addBook = async (req, res) => {
  try {
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).send('Internal Server Error');
  }
};
exports.updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    updatedBook ? res.json(updatedBook) : res.status(404).send('Book not found');
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).send('Internal Server Error');
  } 
};

exports.deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    deletedBook ? res.status(204).send() : res.status(404).send('Book not found');
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).send('Internal Server Error');
  }
};
exports.updateBook = async (req, res) => {
  try {
    const bookId = parseInt(req.params.id);
    const updatedBook = await Book.findByIdAndUpdate(bookId, req.body, { new: true });
    updatedBook ? res.json(updatedBook) : res.status(404).send('Book not found');
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    deletedBook ? res.status(204).send() : res.status(404).send('Book not found');
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).send('Internal Server Error');
  }
};

