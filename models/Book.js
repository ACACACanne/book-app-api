const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, default: 'Unknown' },
  publishedYear: { type: Number },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },


  read: { type: Boolean, default: false }
});

module.exports = mongoose.model('Book', bookSchema);

exports.updateBook = (req, res) => {
  try {
    const bookId = parseInt(req.params.id);
    const updatedData = req.body;

    Book.findByIdAndUpdate(bookId, updatedData, { new: true })
      .then(updatedBook => {
        if (!updatedBook) {
          return res.status(404).json({ message: 'Book not found' });
        }
        res.json(updatedBook);
      })
      .catch(err => {
        console.error('Error updating book:', err);
        res.status(500).json({ message: 'Internal server error' });
      });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
