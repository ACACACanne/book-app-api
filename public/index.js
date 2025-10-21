console.log('Script loaded');



let currentView = 'public';
let currentBooks = [];
let currentUser = {
  token: localStorage.getItem('token') || '',
  role: localStorage.getItem('role') || '',
  username: localStorage.getItem('username') || '',
  userId: localStorage.getItem('userId') || ''
};

// Summary Feedback
function updateSummary(action, book) {
  const panel = document.getElementById('summary-panel');
  const text = document.getElementById('summary-text');

  const phrases = {
    approve: `The stars aligned — "${book.title}" now shines in the public constellation.`,
    delete: `A comet fades — "${book.title}" has been released from orbit.`,
    edit: `Galactic winds shift — "${book.title}" has been reshaped by admin gravity.`,
    add: `A new spark ignites — "${book.title}" awaits celestial approval.`
  };

  text.textContent = phrases[action] || 'A new chapter unfolds...';
  panel.classList.remove('hidden');
  setTimeout(() => panel.classList.add('hidden'), 5000);
}

// UI Helpers
function updateAuthUI() {
  document.getElementById('logout-btn').classList.toggle('hidden', !currentUser.token);
  document.getElementById('view-personal').classList.toggle('hidden', !currentUser.token);
  document.getElementById('view-pending').classList.toggle('hidden', currentUser.role !== 'admin');
}

function updateUserInfo() {
  const info = document.getElementById('user-info');
  info.textContent = currentUser.token
    ? `Logged in as ${currentUser.username} (${currentUser.role})`
    : '';
}

// Load Books
async function loadBooks() {
  const list = document.getElementById('book-list');
  list.innerHTML = '';
  document.getElementById('book-list-section').classList.remove('hidden');

  let url = '/api/books/public';
  let headers = {};

  if (currentView === 'personal') {
    url = '/api/books/my-books';
    headers['Authorization'] = `Bearer ${currentUser.token}`;
  }

  if (currentView === 'pending') {
    url = '/api/books/my-books';
    headers['Authorization'] = `Bearer ${currentUser.token}`;
  }

const res = await fetch(url, { headers });
const data = await res.json();

if (!res.ok) {
  console.error('Error loading books:', data.message);
  alert(data.message);
  return;
}

let books = data;

if (currentView === 'pending') {
  books = books.filter(book => !book.approved);
}

currentBooks = books;
renderBooks(books);


}

// Render Books
function renderBooks(books) {
  const list = document.getElementById('book-list');
  list.innerHTML = '';

  books.forEach(book => {
    const li = document.createElement('li');
    li.className = 'bg-black/40 p-4 rounded shadow';

    li.innerHTML = `
      <div class="flex flex-col md:flex-row gap-4 items-start">
        <img src="${book.coverImageUrl || './default-cover.jpg'}" alt="Cover of ${book.title.replace(/"/g, '&quot;')}" class="w-24 h-auto rounded shadow" />
        <div class="flex-1">
          <strong>Title:</strong> ${book.title.replace(/"/g, '&quot;')}<br>
          <em>Author:</em> ${book.author.replace(/"/g, '&quot;')}<br>
          <span>Genre: ${book.genre.replace(/"/g, '&quot;')}</span><br>
          <span>Published: ${book.publishedYear || 'N/A'}</span><br>
          <span>Rating: ${'★'.repeat(Math.min(book.rating || 0, 5))}${'☆'.repeat(Math.max(0, 5 - (book.rating || 0)))}</span><br>
          <span>Status: <span class="${book.read ? 'text-green-400' : 'text-red-400'}">${book.read ? 'Read' : 'Unread'}</span></span><br />
          ${book.purchaseLink ? `<a href="${book.purchaseLink}" target="_blank" class="text-blue-300 underline mt-2 inline-block">Buy this book</a>` : ''}<br />
          ${book.readOnlineLink ? `<a href="${book.readOnlineLink}" target="_blank" class="text-blue-300 underline mt-2 inline-block">Read Online</a>` : ''}
          <div class="mt-2 flex gap-2 flex-wrap">
            ${[1,2,3,4,5].map(r => `
              <button data-book-id="${book._id}" data-rating="${r}" class="rating-btn text-yellow-400 hover:scale-105 transition">
                ${r === 0 ? '☆' : '★'.repeat(r)}
              </button>
            `).join('')}
            ${currentUser.role === 'admin' ? `
              ${!book.approved ? `<button data-book-id="${book._id}" class="approve-btn bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">Approve</button>` : ''}
              <button data-book-id="${book._id}" class="edit-btn bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition">Edit</button>
              <button data-book-id="${book._id}" class="delete-btn bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition">Delete</button>
            ` : ''}
            ${currentUser.role === 'client' && book.userId === currentUser.userId && !book.public ? `
              <button data-book-id="${book._id}" class="delete-private-btn bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition">Delete</button>
            ` : ''}
          </div>
          <button data-book-id="${book._id}" class="toggle-read-btn mt-2 bg-black text-white px-3 py-1 rounded hover:bg-gray-800 transition">Change Read Status</button>
        </div>
    <div class="md:w-1/2 w-full bg-white/10 p-3 rounded text-sm text-white border border-white/20">
      <h3 class="font-semibold">Summary:</h3>
      <p>${(book.summary || 'No summary available.').replace(/"/g, '&quot;').replace(/'/g, '&#39;')}</p>
    </div>

  </div>
    `;
     document.querySelectorAll('.approve-btn').forEach(btn => {
  btn.onclick = async () => {
    const bookId = btn.getAttribute('data-book-id');
    const res = await fetch(`/api/books/${bookId}/approve`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${currentUser.token}`
      }
    });
    const data = await res.json();
    updateSummary('approve', { title: data.book?.title || 'Book' });
    loadBooks(); // refresh list
  };
});


    list.appendChild(li);
  });
}
// Event Listeners
document.getElementById('view-public').onclick = () => {
  currentView = 'public';
  loadBooks();
};

document.getElementById('view-personal').onclick = () => {
  currentView = 'personal';
  loadBooks();
};

document.getElementById('view-pending').onclick = () => {
  currentView = 'pending';
  loadBooks();
};

document.getElementById('logout-btn').onclick = () => {
  localStorage.clear();
  currentUser = { token: '', role: '', username: '', userId: '' };
  updateAuthUI();
  updateUserInfo();
  loadBooks();
};

// Login/Register Modals
document.getElementById('open-login-modal').onclick = () => {
  document.getElementById('login-modal').classList.remove('hidden');
};
document.getElementById('close-login-modal').onclick = () => {
  document.getElementById('login-modal').classList.add('hidden');
};
document.getElementById('open-register-modal').onclick = () => {
  document.getElementById('register-modal').classList.remove('hidden');
};
document.getElementById('close-register-modal').onclick = () => {
  document.getElementById('register-modal').classList.add('hidden');
};
// Login Form
document.getElementById('login-form').onsubmit = async (e) => {
  e.preventDefault();
  const form = e.target;
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: form.username.value,
      password: form.password.value
    })
  });

  const data = await res.json();
  if (res.ok) {
  const token = data.role === 'admin' ? 'admin-token' : data.token;

  localStorage.setItem('token', token);
  localStorage.setItem('role', data.role);
  localStorage.setItem('username', data.username);
  localStorage.setItem('userId', data.userId);

  currentUser = {
    token,
    role: data.role,
    username: data.username,
    userId: data.userId
  };


    updateAuthUI();
    updateUserInfo();
    loadBooks();
    form.reset();
    document.getElementById('login-modal').classList.add('hidden');
  } else {
    alert(data.message);
  }
};

// Register Form
document.getElementById('register-form').onsubmit = async (e) => {
  e.preventDefault();
  const form = e.target;
  const res = await fetch('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: form.username.value,
      email: form.email.value,
      password: form.password.value
    })
  });

  const data = await res.json();
  if (res.ok) {
    alert('Registration successful! You can now log in.');
    form.reset();
    document.getElementById('register-modal').classList.add('hidden');
  } else {
    alert(data.message);
  }
};

// Add Book Modal
document.getElementById('open-add-modal').onclick = () => {
  document.getElementById('add-modal').classList.remove('hidden');
};
document.getElementById('close-add-modal').onclick = () => {
  document.getElementById('add-modal').classList.add('hidden');
};
// Edit Modal
document.getElementById('close-edit-modal').onclick = () => {
  document.getElementById('edit-modal').classList.add('hidden');
};
// Delete Modal
document.getElementById('close-delete-modal').onclick = () => {
  document.getElementById('delete-modal').classList.add('hidden');
};
document.getElementById('cancel-delete').onclick = () => {
  document.getElementById('delete-modal').classList.add('hidden');
};

// Add Book Form
document.getElementById('add-book-form').onsubmit = async (e) => {
  e.preventDefault();
  const form = e.target;
  const book = {
    title: form.title.value,
    author: form.author.value,
    genre: form.genre.value,
    publishedYear: form.publishedYear.value,
    coverImageUrl: form.coverImageUrl.value,
    purchaseLink: form.purchaseLink.value,
    readOnlineLink: form.readOnlineLink.value,
    summary: form.summary.value,
    read: form.read.checked,
    public: form.public?.checked,
    approved: false
  };

  const res = await fetch('/api/books', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${currentUser.token}`
    },
    body: JSON.stringify(book)
  });

  const data = await res.json();
  if (res.ok) {
    updateSummary('add', data.book);
    form.reset();
    document.getElementById('add-modal').classList.add('hidden');
    loadBooks();
  } else {
    alert(data.message);
  }
};
// Delegated Actions
document.addEventListener('click', async (e) => {
  const bookId = e.target.dataset.bookId;

  // Approve
  if (e.target.classList.contains('approve-btn')) {
    await fetch(`/api/books/${bookId}/approve`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${currentUser.token}` }
    });
    const book = currentBooks.find(b => b._id === bookId);
    updateSummary('approve', book);
    loadBooks();
  }

  // Delete (admin)
  if (e.target.classList.contains('delete-btn')) {
    const book = currentBooks.find(b => b._id === bookId);
    document.getElementById('delete-title').textContent = book.title;
    document.getElementById('delete-modal').classList.remove('hidden');

    document.getElementById('confirm-delete').onclick = async () => {
      await fetch(`/api/books/${bookId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      updateSummary('delete', book);
      document.getElementById('delete-modal').classList.add('hidden');
      loadBooks();
    };
  }

  // Delete (private)
  if (e.target.classList.contains('delete-private-btn')) {
    await fetch(`/api/books/${bookId}/private`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${currentUser.token}` }
    });
    const book = currentBooks.find(b => b._id === bookId);
    updateSummary('delete', book);
    loadBooks();
  }

  // Toggle Read Status
  if (e.target.classList.contains('toggle-read-btn')) {
    await fetch(`/api/books/${bookId}/readStatus`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${currentUser.token}` }
    });
    loadBooks();
  }

  // Rate Book
  if (e.target.classList.contains('rating-btn')) {
    const rating = e.target.dataset.rating;
    await fetch(`/api/books/${bookId}/rating`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${currentUser.token}`
      },
      body: JSON.stringify({ rating })
    });
    loadBooks();
  }

  // Edit Book
  if (e.target.classList.contains('edit-btn')) {
    const book = currentBooks.find(b => b._id === bookId);
    const form = document.getElementById('edit-book-form');
    form.id.value = book._id;
    form.title.value = book.title;
    form.author.value = book.author;
    form.genre.value = book.genre;
    form.publishedYear.value = book.publishedYear;
    form.coverImageUrl.value = book.coverImageUrl;
    form.purchaseLink.value = book.purchaseLink;
    form.readOnlineLink.value = book.readOnlineLink;
    form.rating.value = book.rating;
    form.summary.value = book.summary;
    form.read.checked = book.read;
    document.getElementById('edit-modal').classList.remove('hidden');
  }
});

document.getElementById('edit-book-form').onsubmit = async (e) => {
  e.preventDefault();
  const form = e.target;
  const bookId = form.id.value;
  const updated = {
    title: form.title.value,
    author: form.author.value,
    genre: form.genre.value,
    publishedYear: form.publishedYear.value,
    coverImageUrl: form.coverImageUrl.value,
    purchaseLink: form.purchaseLink.value,
    readOnlineLink: form.readOnlineLink.value,
    rating: form.rating.value,
    summary: form.summary.value,
    read: form.read.checked
  };

  await fetch(`/api/books/${bookId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${currentUser.token}`
    },
    body: JSON.stringify(updated)
  });

  updateSummary('edit', updated); 
  document.getElementById('edit-modal').classList.add('hidden');
  loadBooks();
  const res = await fetch(`/api/books/${bookId}`, {
  headers: { Authorization: `Bearer ${currentUser.token}` }
});
const updatedBook = await res.json();
updateSummary('edit', updatedBook);



};

// Initial Load
updateAuthUI();
updateUserInfo();
loadBooks();

