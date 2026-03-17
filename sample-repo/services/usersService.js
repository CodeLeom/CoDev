/**
 * Users service: user persistence and retrieval
 */

const users = [
  { id: 'user-1', email: 'alice@example.com', name: 'Alice' },
  { id: 'user-2', email: 'bob@example.com', name: 'Bob' },
];

async function list() {
  return users;
}

async function getById(id) {
  return users.find((u) => u.id === id) || null;
}

module.exports = { list, getById };
