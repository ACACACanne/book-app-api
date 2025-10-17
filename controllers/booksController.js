let books = [
  { id: 1, title: '1984', author: 'George Orwell', read: true },
  { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', read: false },
];

exports.getAllBooks = (req, res) => {
  res.json(books);
};

exports.getBookById = (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  book ? res.json(book) : res.status(404).send('Book not found');
};

exports.getBooksByAuthor = (req, res) => {
  const author = req.params.author.toLowerCase();
  const filtered = books.filter(b => b.author.toLowerCase() === author);
  res.json(filtered);
};

exports.getBooksByTitle = (req, res) => {
  const title = req.params.title.toLowerCase();
  const filtered = books.filter(b => b.title.toLowerCase().includes(title));
  res.json(filtered);
};

exports.addBook = (req, res) => {
  const newBook = req.body;
  newBook.id = books.length + 1;
  newBook.read = newBook.read ?? false;
  books.push(newBook);
  res.status(201).json(newBook);
};

exports.updateBook = (req, res) => {
  const bookId = parseInt(req.params.id);
  const updatedBook = req.body;
  books = books.map(b => b.id === bookId ? updatedBook : b);
  res.json(updatedBook);
};

exports.deleteBook = (req, res) => {
  const bookId = parseInt(req.params.id);
  books = books.filter(b => b.id !== bookId);
  res.status(204).send();
};

