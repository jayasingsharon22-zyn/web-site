# Router Care — WiFi Update Demo

A polished HTML/CSS/JavaScript interface inspired by the supplied neon AI landing-page reference.

## What it does

1. Shows "Your WiFi router needs an update".
2. Asks the visitor to enter a comment.
3. Sends the comment to `POST /api/comments`.
4. Saves the comment with a timestamp and unique ID in `data/comments.json`.
5. Shows a smooth loading animation.
6. Displays "Thank you for your time".

This demo intentionally does **not** request router passwords, WiFi keys, login credentials, or other sensitive information.

## Run locally

Requires Node.js 18+.

```bash
npm start
```

Then open:

http://localhost:3000

Comments are stored in:

`data/comments.json`

## Connecting your real database

The included storage is a small local JSON-backed demo database so the project runs without external credentials.

For production, replace `saveComment()` in `server.js` with your database insert:
- MySQL / MariaDB
- PostgreSQL
- MongoDB
- Supabase
- Firebase

Do not put database passwords or service-role keys inside `public/app.js`.

## Files

- `public/index.html` — page structure
- `public/styles.css` — neon visual design and animations
- `public/app.js` — form submission and UI flow
- `server.js` — API + comment persistence
- `data/comments.json` — local comment database
- `package.json` — run configuration
