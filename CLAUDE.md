# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Loqulii (GamerGab) is a social media platform built with Express.js, Pug templates, jQuery, and MongoDB/Mongoose. It is a traditional server-rendered MVC app (not a SPA). The live backend is no longer available — the project is being converted to run entirely on fixture data for demo purposes.

## Commands

- **Start server:** `npm start` (runs `node app.js` on port 3000)
- **Dev mode:** `npm run dev` (uses nodemon for auto-reload)
- **No test suite or build pipeline configured**

## Architecture

### Server (Express MVC)
- **Entry point:** `app.js` — Express setup, middleware stack, route registration
- **Database:** `database.js` — Mongoose connection to MongoDB Atlas (no longer live)
- **Auth middleware:** `middleware.js` — `requireLogin` checks `req.session.user`
- **Session:** express-session stored in-memory, bcrypt for password hashing

### Routes
- **Page routes** (`/routes/*.js`): Render Pug templates — login, register, profile, search, mail, post pages
- **API routes** (`/routes/api/*.js`): REST endpoints consumed by jQuery AJAX
  - `postRoutes.js` — CRUD for posts, likes, retweets, pins, replies
  - `usersRoutes.js` — user search, follow/unfollow, profile/cover photo upload (multer)
  - `chatRoutes.js` — chat creation, listing, rename
  - `messageRoutes.js` — send/list messages

### Schemas (`/schemas/`)
Four Mongoose models: User, Post, Chat, Message. Heavy use of `.populate()` for cross-references. Relationships managed via `$addToSet`/`$pull` on arrays (likes, followers, following, retweetUsers).

### Frontend
- **Templates:** `/views/` — Pug with layouts (`main-layout.pug`, `login-layout.pug`) and mixins (`mixins.pug`)
- **Client JS:** `/public/js/` — jQuery-driven, one file per page plus `common.js` for shared logic (post rendering, likes, retweets, follows, image upload, chat creation)
- **Styling:** SCSS in `/public/css/`, compiled output in `/public/css/dist/`
- **CDN deps:** jQuery 3.5.1, Bootstrap 4.4.1, Font Awesome 5, Cropper.js 1.5.9
- **Static assets:** Served from `/public/`; user uploads go to `/uploads/images/`

### Data Flow
1. Pug templates receive `userLoggedIn` and `userLoggedInJs` from Express
2. Client JS makes AJAX calls to `/api/*` endpoints
3. API routes query MongoDB via Mongoose, return JSON
4. Client JS renders results into DOM using jQuery

### Key Patterns
- All interactivity via Bootstrap modals and jQuery DOM manipulation
- Search uses MongoDB `$regex` with 1-second client-side debounce
- Retweets are posts with a `retweetData` reference to the original
- Replies are posts with a `replyTo` reference to the parent
- Image uploads use multer → local filesystem → path stored in user document
