let allBooks = [];

// Show book list and form when "View Book List" is clicked
document.getElementById('view-book-list').addEventListener('click', () => {
  document.getElementById('book-form-section').style.display = 'block';
  document.getElementById('book-list-section').style.display = 'block';
  document.getElementById('controls').style.display = 'grid';
  loadBooks();
});

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
  await loadBooks();
});

// Load books from API
async function loadBooks() {
  const res = await fetch('/api/books');
  allBooks = await res.json();
  renderBooks();
}

// Render books based on sort and range
function renderBooks() {
  const list = document.getElementById('book-list');
  const sortValue = document.getElementById('sort').value;
  const rangeValue = parseInt(document.getElementById('range').value);
  document.getElementById('range-value').textContent = rangeValue;

  let books = [...allBooks];

  // Sorting logic
  switch (sortValue) {
    case 'title-asc': books.sort((a, b) => a.title.localeCompare(b.title)); break;
    case 'title-desc': books.sort((a, b) => b.title.localeCompare(a.title)); break;
    case 'author-asc': books.sort((a, b) => a.author.localeCompare(b.author)); break;
    case 'author-desc': books.sort((a, b) => b.author.localeCompare(a.author)); break;
    case 'year-asc': books.sort((a, b) => (a.publishedYear || 0) - (b.publishedYear || 0)); break;
    case 'year-desc': books.sort((a, b) => (b.publishedYear || 0) - (a.publishedYear || 0)); break;
    case 'rating-asc': books.sort((a, b) => a.rating - b.rating); break;
    case 'rating-desc': books.sort((a, b) => b.rating - a.rating); break;
    case 'read-status': books = books.filter(b => b.read); break;
    case 'unread-status': books = books.filter(b => !b.read); break;
    case 'genre-asc': books.sort((a, b) => a.genre.localeCompare(b.genre)); break;
    case 'genre-desc': books.sort((a, b) => b.genre.localeCompare(a.genre)); break;
  }

  books = books.slice(0, rangeValue);
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
          <span>Rating: ${'★'.repeat(book.rating || 0)}${'☆'.repeat(5 - (book.rating || 0))}</span><br>
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

// Sort and range listeners
document.getElementById('sort').addEventListener('change', renderBooks);
document.getElementById('range').addEventListener('input', renderBooks);



