# Sample Express API

A small Express API with authentication, used to demonstrate CoDev indexing and generation modes.

## Structure

- `index.js` — Entry point, registers routes
- `routes/` — Auth and users routes
- `controllers/` — Request handlers
- `services/` — Business logic
- `middleware/` — Auth middleware

## Endpoints

### Auth

- `POST /api/auth/login` — Login with email and password
- `POST /api/auth/register` — Register new user

### Users (protected)

- `GET /api/users` — List users
- `GET /api/users/:id` — Get user by ID

## Run

```bash
node index.js
```
