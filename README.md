# Requisitos del Proyecto: Web App "Quiz Game"

## 1. Descripción del Proyecto
Una aplicación web interactiva tipo "Quiz Game" que permite a los usuarios:
- Registrarse e iniciar sesión.
- Responder preguntas de diferentes categorías y niveles de dificultad.
- Visualizar su puntuación y progreso.
- Acceder a un historial de juegos anteriores.

La app utilizará **Remix JS** para la estructura y routing, **Redux** para el manejo del estado global y **Bulma CSS** para el diseño y estilo responsive.

---

## 2. Requisitos Funcionales

### 2.1 Gestión de Usuario
- Registro de usuario con correo electrónico y contraseña.
- Inicio y cierre de sesión seguro.
- Perfil de usuario con historial de juegos y puntuaciones.

### 2.2 Juego de Quiz
- Selección de categorías (ej. Historia, Ciencia, Tecnología).
- Preguntas aleatorias con opciones múltiples.
- Validación inmediata de respuestas.
- Sistema de puntuación basado en aciertos y velocidad.
- Feedback visual después de cada respuesta (correcta/incorrecta).

### 2.3 Tablero y Estadísticas
- Visualización de puntuación total y promedio.
- Ranking de los mejores jugadores.
- Historial de partidas por usuario.

---

## 3. Requisitos No Funcionales
- Aplicación **responsive**, compatible con escritorio y móvil.
- Rendimiento óptimo, con carga rápida de preguntas y recursos.
- Seguridad en autenticación y almacenamiento de datos.
- Código modular y escalable utilizando **Remix JS** y **Redux**.

---

## 4. Tecnologías Requeridas
- **Frontend:**
  - [Remix JS](https://remix.run/) (Routing y server-side rendering)
  - [Redux](https://redux.js.org/) (Gestión del estado global)
  - [Bulma CSS](https://bulma.io/) (Diseño y estilo)
  - JavaScript (ES6+)
  - HTML5 y CSS3

- **Backend / API:**
  - Puede integrarse con un backend en Node.js o consumir APIs externas de preguntas de quiz.
  - Autenticación JWT o sesiones seguras.

- **Base de Datos:**
  - Relacional (PostgreSQL, MySQL) o NoSQL (MongoDB)
  - Guardar usuarios, preguntas y resultados de partidas.

---

## 5. Arquitectura y Estructura de Archivos (Sugerida)
