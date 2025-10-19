let allBooks = [];
let currentEditId = null;
let currentDeleteId = null;

// Modal logic
const addModal = document.getElementById('add-modal');
const editModal = document.getElementById('edit-modal');
const deleteModal = document.getElementById('delete-modal');

document.getElementById('open-add-modal').addEventListener('click', () => {
  addModal.style.display = 'flex';
});

document.getElementById('close-add-modal').addEventListener('click', () => {
  addModal.style.display = 'none';
});

document.getElementById('close-edit-modal').addEventListener('click', () => {
  editModal.style.display = 'none';
});

document.getElementById('close-delete-modal').addEventListener('click', () => {
  deleteModal.style.display = 'none';
});

// Add Book
document.getElementById('add-book-form').addEventListener('submit', async (e) => {
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
    readOnlineLink: form.readOnlineLink.value,
    read: form.read.checked,
    summary: form.summary.value,
  };

  await fetch('/api/books', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book)
  });

  form.reset();
  addModal.style.display = 'none';
  await loadBooks();
});

// View Book List
document.getElementById('view-book-list').addEventListener('click', () => {
  document.getElementById('book-list-section').style.display = 'block';
  document.getElementById('controls').style.display = 'grid';
  loadBooks();
});

// Load Books
async function loadBooks() {
  const res = await fetch('/api/books');
  allBooks = await res.json();
  renderBooks();
}



// Render Books
function renderBooks() {
  const list = document.getElementById('book-list');
  const sortValue = document.getElementById('sort').value;
  const rangeValue = parseInt(document.getElementById('range').value);
  document.getElementById('range-value').textContent = rangeValue;

  let books = [...allBooks];

  switch (sortValue) {
    case 'title-asc': books.sort((a, b) => a.title.localeCompare(b.title)); break;
    case 'title-desc': books.sort((a, b) => b.title.localeCompare(a.title)); break;
    case 'author-asc': books.sort((a, b) => a.author.localeCompare(b.author)); break;
    case 'author-desc': books.sort((a, b) => b.author.localeCompare(a.author)); break;
    case 'year-asc': books.sort((a, b) => (a.publishedYear || 0) - (b.publishedYear || 0)); break;
    case 'year-desc': books.sort((a, b) => (b.publishedYear || 0) - (a.publishedYear || 0)); break;
    case 'rating-asc': books.sort((a, b) => (a.rating || 0) - (b.rating || 0)); break;
    case 'rating-desc': books.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
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
          <span>Rating: ${'★'.repeat(Math.min(book.rating || 0, 5))}${'☆'.repeat(Math.max(0, 5 - (book.rating || 0)))}</span><br>
          <span>Status: <span class="${book.read ? 'text-green-400' : 'text-red-400'}">${book.read ? 'Read' : 'Unread'}</span></span><br />
          ${book.purchaseLink ? `<a href="${book.purchaseLink}" target="_blank" class="text-blue-300 underline mt-2 inline-block">Buy this book</a>` : ''}<br />
          ${book.readOnlineLink ? `<a href="${book.readOnlineLink}" target="_blank" class="text-blue-300 underline mt-2 inline-block">Read Online</a>` : ''}
          <div class="mt-2 flex gap-2 flex-wrap">
            ${[1,2,3,4,5].map(r => `
              <button onclick="updateRating('${book._id}', ${r})" class="text-yellow-400 hover:scale-105 transition">
                ${r === 0 ? '☆' : '★'.repeat(r)}
              </button>
            `).join('')}
            <button onclick='openEditModal(${JSON.stringify(book).replace(/"/g, "&quot;")})' class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition">Edit</button>
            <button onclick='openDeleteModal(${JSON.stringify(book).replace(/"/g, "&quot;")})' class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition">Delete</button>
          </div>
          <button onclick="toggleReadStatus('${book._id}')" class="mt-2 bg-black text-white px-3 py-1 rounded hover:bg-gray-800 transition">Change Read Status</button>
        </div>
        <div class="md:w-1/2 w-full bg-white/10 p-3 rounded text-sm text-white border border-white/20">
          <h3 class="font-semibold">Summary:</h3>
          <p>${book.summary || 'No summary available.'}</p>
        </div>
      </div>
    `;
    list.appendChild(li);
  });
}

// Update Rating
function updateRating(bookId, rating) {
  const clamped = Math.max(0, Math.min(rating, 5));
  fetch(`/api/books/${bookId}/rating`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rating: clamped })
  }).then(() => loadBooks());
}

// Toggle Read Status
function toggleReadStatus(bookId) {
  fetch(`/api/books/${bookId}/readStatus`, {
    method: 'PATCH'
  }).then(() => loadBooks());
}

// Open Edit Modal
function openEditModal(book) {
  currentEditId = book._id;
  const form = document.getElementById('edit-book-form');
  form.id.value = book._id;
  form.title.value = book.title;
  form.author.value = book.author;
  form.genre.value = book.genre;
  form.publishedYear.value = book.publishedYear || '';
  form.coverImageUrl.value = book.coverImageUrl || '';
  form.purchaseLink.value = book.purchaseLink || '';
  form.readOnlineLink.value = book.readOnlineLink || '';
  form.read.checked = book.read;
  form.rating.value = book.rating || 0;
  form.summary.value = book.summary || '';
  editModal.style.display = 'flex';
}

// Open Delete Modal
function openDeleteModal(book) {
  currentDeleteId = book._id;
  document.getElementById('delete-title').textContent = book.title;
  deleteModal.style.display = 'flex';
}

// 📝 Submit Edit Form
document.getElementById('edit-book-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;

  const updatedBook = {
    title: form.title.value,
    author: form.author.value,
    genre: form.genre.value,
    publishedYear: parseInt(form.publishedYear.value),
    coverImageUrl: form.coverImageUrl.value,
    purchaseLink: form.purchaseLink.value,
    readOnlineLink: form.readOnlineLink.value,
    read: form.read.checked,
    rating: parseInt(form.rating.value),
    summary: form.summary.value
  };

  await fetch(`/api/books/${currentEditId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedBook)
  });

  editModal.style.display = 'none';
  await loadBooks();
});

// Confirm Delete
document.getElementById('confirm-delete').addEventListener('click', async () => {
  await fetch(`/api/books/${currentDeleteId}`, {
    method: 'DELETE'
  });

  deleteModal.style.display = 'none';
  await loadBooks();
});


// Sort and Range Listeners
document.getElementById('sort').addEventListener('change', renderBooks);
document.getElementById('range').addEventListener('input', renderBooks);







