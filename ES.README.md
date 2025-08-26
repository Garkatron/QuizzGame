# QuizzGame

QuizzGame es un juego de preguntas y respuestas con soporte para **singleplayer y online**, desarrollado con React en el frontend y Node.js/Express en el backend.

## Tecnologías

**Frontend:**

* React
* React Router
* Bulma CSS
* JavaScript

**Backend:**

* Node.js
* Express
* dotenv
* bcryptjs (para hash de contraseñas)
* MongoDB + Mongoose
* JSON Web Tokens (JWT) para autenticación
* Permisos personalizados para acceso al CRUD
* Socket.io para lógica de juego en tiempo real

**Testing:**

* Babel
* Mocha
* Pactum
* MongoDB Memory Server

## Estado del proyecto

### Frontend

* [x] Welcome
* [x] Login
* [x] Register
* [ ] Singleplayer
* [ ] Online después de login

### Backend

* [x] Node.js + Express
* [x] dotenv configurado
* [x] bcryptjs para contraseñas
* [x] Lógica básica de Socket.io
* [ ] Pulir lógica de juego
* [x] CRUD con JWT y permisos
* [x] MongoDB + Mongoose configurado

### Testing

* [x] Tests de permisos y tokens
* [x] Parte del CRUD testeada
* [ ] Tests de lógica de juego
* [ ] Tests de rutas frontend (si aplica)

## Próximas tareas

* [ ] Implementar Singleplayer en frontend
* [ ] Permitir jugar Online después de login
* [ ] Completar la lógica del juego en backend
* [ ] Mejorar validaciones y manejo de errores en backend
* [ ] Completar tests faltantes (CRUD, lógica de juego, frontend)
* [ ] Documentar endpoints del backend
* [ ] Mejorar interfaz y estilo en frontend
