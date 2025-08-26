# QuizzGame

QuizzGame is a quiz game with support for **singleplayer and online multiplayer**, developed with React on the frontend and Node.js/Express on the backend.

[Spanish README.md](./ES.README.md)

## Technologies

**Frontend:**

* React
* React Router
* Bulma CSS
* JavaScript

**Backend:**

* Node.js
* Express
* dotenv
* bcryptjs (for password hashing)
* MongoDB + Mongoose
* JSON Web Tokens (JWT) for authentication
* Custom permissions for CRUD access
* Socket.io for real-time game logic

**Testing:**

* Babel
* Mocha
* Pactum
* MongoDB Memory Server

## Project Status

### Frontend

* [x] Welcome
* [x] Login
* [x] Register
* [ ] Singleplayer
* [ ] Online after login

### Backend

* [x] Node.js + Express
* [x] dotenv configured
* [x] bcryptjs for passwords
* [x] Basic Socket.io logic
* [ ] Polish game logic
* [x] CRUD with JWT and permissions
* [x] MongoDB + Mongoose configured

### Testing

* [x] Tests for permissions and tokens
* [x] Part of CRUD tested
* [ ] Game logic tests
* [ ] Frontend routes tests (if applicable)

## Next tasks

* [ ] Implement Singleplayer in frontend
* [ ] Enable Online play after login
* [ ] Complete game logic in backend
* [ ] Improve validations and error handling in backend
* [ ] Complete missing tests (CRUD, game logic, frontend)
* [ ] Document backend endpoints
* [ ] Improve UI and styling in frontend

