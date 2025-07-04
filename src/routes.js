const { addBook, getBooks, getBookById, updateBookById, deleteBookById } = require('./handler');

const routes = [
  {
    method: 'GET',
    path: '/books',
    handler: getBooks
  },
  {
    method: 'POST',
    path: '/books',
    handler: addBook,
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: getBookById
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: updateBookById
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteBookById
  }
];

module.exports = routes;