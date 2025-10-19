// Handle form submission to add a new book
document.getElementById('book-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;

  const book = {
    title: form.title.value,
    author: form.author.value,
    genre: form.genre.value,
    publishedYear: parseInt(form.publishedYear.value),
    rating: parseInt(form.rating.value),
    coverImageUrl: form.coverImageUrl.value,
    purchaseLink: form.purchaseLink.value,
    read: form.read.checked
  };

  await fetch('/api/books', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book)
  });

  form.reset();
  loadBooks();
});

// Load and render all books
function loadBooks() {
  fetch('/api/books')
    .then(res => res.json())
    .then(books => {
      const list = document.getElementById('book-list');
      list.innerHTML = '';
      books.forEach(book => {
        const li = document.createElement('li');
        li.className = 'bg-white/10 p-4 rounded shadow';

        li.innerHTML = `
          <div class="flex gap-4 items-start">
            <img src="${book.coverImageUrl || './default-cover.jpg'}" alt="Cover of ${book.title}" class="w-24 h-auto rounded shadow" />
            <div class="flex-1">
              <strong>Title:</strong> ${book.title}<br>
              <em>Author:</em> ${book.author}<br>
              <span>Genre: ${book.genre}</span><br>
              <span>Published: ${book.publishedYear || 'N/A'}</span><br>
              <span>Rating: ${'★'.repeat(book.rating)}${'☆'.repeat(5 - book.rating)}</span><br>
              <span>Status: <span class="${book.read ? 'text-green-400' : 'text-red-400'}">${book.read ? 'Read' : 'Unread'}</span></span><br>
              ${book.purchaseLink ? `<a href="${book.purchaseLink}" target="_blank" class="text-blue-300 underline mt-2 inline-block">Buy this book</a>` : ''}
              <div class="mt-2 flex gap-1">
                ${[1,2,3,4,5].map(r => `
                  <button onclick="updateRating('${book._id}', ${r})" class="text-yellow-400 hover:scale-105 transition">
                    ${'★'.repeat(r)}
                  </button>
                `).join('')}
              </div>
              <button onclick="toggleReadStatus('${book._id}')" class="mt-2 bg-black text-white px-3 py-1 rounded hover:bg-gray-800 transition">
                Toggle Read Status
              </button>
            </div>
          </div>
        `;
        list.appendChild(li);
      });
    });
// Add a new book
function addBook(book) {
  fetch('/api/books', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book)
  }).then(() => loadBooks());
}

function editBook(bookId, updatedData) {
  fetch(`/api/books/${bookId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData)
  }).then(() => loadBooks());
}

function deleteBook(bookId) {
  fetch(`/api/books/${bookId}`, {
    method: 'DELETE'
  }).then(() => loadBooks());
}

// Update book rating
function updateRating(bookId, rating) {
  fetch(`/api/books/${bookId}/rating`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rating })
  }).then(() => loadBooks());
}

// Toggle read/unread status
function toggleReadStatus(bookId) {
  fetch(`/api/books/${bookId}/readStatus`, {
    method: 'PATCH'
  }).then(() => loadBooks());
}

// Initial load
loadBooks();
}