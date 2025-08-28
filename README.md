# QuizzGame

QuizzGame is a quiz game with support for both **singleplayer mode** (via API) and **online multiplayer mode** (via WebSockets).  
It is built with **React** on the frontend and **Node.js/Express** on the backend, using **MongoDB** as the database and **Socket.io** for real-time multiplayer logic.  

👉 The project includes **JWT authentication**, **role-based permissions**, and a **comprehensive testing setup**.

[README in Spanish](./ES.README.md)

---

## 🚀 Technologies

### Frontend
- React + React Router  
- Bulma CSS / Tailwind (styling)  
- TypeScript + Vite (modern DX)  

### Backend
- Node.js + Express  
- MongoDB + Mongoose  
- dotenv  
- bcryptjs (password hashing)  
- JSON Web Tokens (JWT) for authentication  
- Custom permissions for CRUD operations  
- Socket.io (real-time multiplayer logic)  

### Testing
- Mocha + Chai  
- Pactum (API integration tests)  
- MongoDB Memory Server (in-memory database for testing)  
- Babel  

---

## 📌 Project Status

### Frontend
- [x] Welcome screen  
- [x] Login / Register  
- [ ] Singleplayer mode  
- [ ] Multiplayer mode after login  

### Backend
- [x] API with Node.js + Express  
- [x] dotenv configured  
- [x] Password hashing with bcryptjs  
- [x] JWT-protected CRUD with permissions  
- [x] MongoDB + Mongoose configured  
- [x] Basic Socket.io setup  
- [ ] Complete game logic  

### Testing
- [x] Tests for permissions and tokens  
- [x] Partial CRUD tests  
- [ ] Game logic tests  
- [ ] Frontend route tests  

---

## 🛠️ Next Tasks
- [ ] Implement Singleplayer mode in frontend  
- [ ] Enable Multiplayer mode after login  
- [ ] Complete backend game logic  
- [ ] Improve backend validations and error handling  
- [ ] Expand test coverage (CRUD, game logic, frontend)  
- [ ] Document backend API endpoints  
- [ ] Enhance UI/UX in frontend  

---

## 🌟 Key Features
- ✅ JWT authentication with role-based permissions  
- ✅ Hybrid architecture: Singleplayer via REST API, Multiplayer via WebSockets  
- ✅ Real-time multiplayer with Socket.io  
- ✅ MongoDB + Mongoose database models  
- ✅ Comprehensive test suite with Mocha, Chai, Pactum, and in-memory DB  

---
