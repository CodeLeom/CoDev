# Diátaxis in CoDev

## What is Diátaxis?

Diátaxis is a documentation framework that separates docs into four distinct types based on user intent:

- **Tutorial** — Learning-oriented; teaches a skill
- **How-to** — Task-oriented; solves a specific problem
- **Explanation** — Concept-oriented; explains background and rationale
- **Reference** — Fact-oriented; structured lookup material

Each type has different structure, tone, and assumptions about the reader.

## Why It Matters

Many docs treat everything the same. A developer who wants to *do* something (how-to) gets different value from one who wants to *understand* something (explanation) or *look up* something (reference).

Diátaxis makes documentation fit for purpose instead of one-size-fits-all.

## How CoDev Uses It

CoDev generates each type from the *same* codebase context but with different prompt instructions.

### Tutorial

- **Purpose** — Step-by-step learning for someone new
- **Style** — Sequential, outcome-focused, beginner-friendly
- **Example prompt** — "Create a tutorial for using the auth module"

### How-to

- **Purpose** — Complete a specific task
- **Style** — Concise, practical, assumes the user knows the basics
- **Example prompt** — "Write a how-to for adding JWT auth to a route"

### Explanation

- **Purpose** — Understand why things work as they do
- **Style** — Conceptual, discusses tradeoffs and design rationale
- **Example prompt** — "Explain why the middleware stack is structured this way"

### Reference

- **Purpose** — Look up facts and structure
- **Style** — Structured, low narrative, scannable
- **Example prompt** — "Generate reference docs for the auth controller"

---

## Example Outputs from the Same Source

Given `routes/auth.js` and `middleware/auth.js`:

- **Tutorial** — "First, install the dependencies. Then configure the middleware. Finally, protect your routes..."
- **How-to** — "1. Add the auth middleware to your route. 2. Ensure the token is in the Authorization header..."
- **Explanation** — "The middleware validates the Bearer token before attaching user data to the request. This design keeps auth concerns separate from business logic..."
- **Reference** — "POST /login — Accepts { email, password }. Returns { token, user }. See routes/auth.js:7..."

Same context; different documentation type for different reader goals.
