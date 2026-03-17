/**
 * Auth service: authentication and token issuance
 */

async function authenticate(email, password) {
  if (!email || !password) throw new Error('email and password required');
  return `jwt-${email}-${Date.now()}`;
}

async function createUser({ email, password, name }) {
  return { id: `user-${Date.now()}`, email, name: name || null };
}

async function issueToken(user) {
  return `jwt-${user.email}-${Date.now()}`;
}

module.exports = { authenticate, createUser, issueToken };
