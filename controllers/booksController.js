const Book = require('../models/Book');

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    book ? res.json(book) : res.status(404).send('Book not found');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

exports.getBooksByAuthor = async (req, res) => {
  try {
    const author = req.params.author.toLowerCase();
    const filtered = await Book.find({ author }).exec();
    res.json(filtered);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

exports.getBooksByTitle = async (req, res) => {
  try {
    const title = req.params.title.toLowerCase();
    const filtered = await Book.find({ title: { $regex: title, $options: 'i' } }).exec();
    res.json(filtered);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

exports.getBooksByGenre = async (req, res) => {
  try {
    const genre = req.params.genre.toLowerCase();
    const filtered = await Book.find({ genre }).exec();
    res.json(filtered);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

exports.getBooksByPublishedYear = async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const filtered = await Book.find({ publishedYear: year }).exec();
    res.json(filtered);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

exports.getBooksByRating = async (req, res) => {
  try {
    const rating = parseFloat(req.params.rating);
    const filtered = await Book.find({ rating }).exec();
    res.json(filtered);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

exports.addBook = async (req, res) => {
  try {
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

exports.updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    updatedBook ? res.json(updatedBook) : res.status(404).send('Book not found');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    deletedBook ? res.status(204).send() : res.status(404).send('Book not found');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

exports.updateBookRating = async (req, res) => {
  const { rating } = req.body;

  //  Add validation for rating
  if (rating < 0 || rating > 5) {
    return res.status(400).send('Rating must be between 0 and 5');
  }

  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { rating },
      { new: true }
    );
    updatedBook
      ? res.json(updatedBook)
      : res.status(404).send('Book not found');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

exports.updateBookReadStatus = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).send('Book not found');
    book.read = !book.read;
    await book.save();
    res.json(book);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};


