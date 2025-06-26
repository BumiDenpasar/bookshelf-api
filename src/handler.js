const { nanoid } = require('nanoid');
const books = require('./books');

function addBook(request, h){
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = h.request.payload;

  if (!name){
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount){
    const response = h.response({
      'status': 'fail',
      'message': 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    });
    response.code(400);
    return response;
  }

  const newBook = {
    'id': nanoid(),
    'name': name,
    'year': year,
    'author': author,
    'summary': summary,
    'publisher': publisher,
    'pageCount': pageCount,
    'readPage': readPage,
    'reading': reading,
    'finished': pageCount === readPage ? true : false,
    'insertedAt': new Date().toISOString(),
    'updatedAt': new Date().toISOString()
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === newBook.id).length > 0;
  if (isSuccess){
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: newBook.id
      }
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan'
  });
  response.code(500);
  return response;
}

function getBooks(request, h){
  const { name, reading, finished } = request.query;

  let filteredBooks = books;

  if (name){
    filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (reading){
    filteredBooks = filteredBooks.filter((book) => book.reading === !!Number(reading));
  }

  if (finished){
    filteredBooks = filteredBooks.filter((book) => book.finished === !!Number(finished));
  }

  if (filteredBooks.length === 0){
    const response = h.response({
      status: 'success',
      data: {
        books: []
      }
    });
    return response;
  }

  const response = h.response({
    'status': 'success',
    'data': {
      'books': filteredBooks.map((book) => ({
        'id': book.id,
        'name': book.name,
        'publisher': book.publisher
      }))
    }
  });
  return response;
}

function getBookById(request, h){
  const { id } = request.params;
  const book = books.filter((n) => n.id === id)[0];
  if (book !== undefined){
    return {
      status: 'success',
      data: {
        book
      }
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  });
  response.code(404);
  return response;
}

function updateBookById(request, h){
  const { id } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = h.request.payload;
  if (!name){
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount){
    const response = h.response({
      'status': 'fail',
      'message': 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    });
    response.code(400);
    return response;
  }


  const book = books.filter((n) => n.id === id)[0];

  if (book !== undefined){
    book.name = name;
    book.year = year;
    book.author = author;
    book.summary = summary;
    book.publisher = publisher;
    book.reading = reading;
    book.pageCount = pageCount;
    book.readPage = readPage;
    book.finished = pageCount === readPage ? true : false;
    book.updatedAt = new Date().toISOString();
    return {
      status: 'success',
      message: 'Buku berhasil diperbarui'
    };
  }


  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  });
  response.code(404);
  return response;
}

function deleteBookById(request, h){
  const { id } = request.params;
  const book = books.filter((n) => n.id === id)[0];
  if (book !== undefined){
    books.splice(books.indexOf(book), 1);
    return {
      status: 'success',
      message: 'Buku berhasil dihapus'
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  });
  response.code(404);
  return response;
}

module.exports = {
  addBook,
  getBooks,
  getBookById,
  updateBookById,
  deleteBookById
};