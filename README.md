# Car Dealership Inventory System

A modern, responsive full-stack web application designed for car dealerships to manage their vehicle inventory seamlessly. Built using a robust Spring Boot backend and a sleek, glassmorphism-styled React frontend.

## Features
- **User Authentication**: Secure registration and login using JWT (JSON Web Tokens).
- **Role-Based Access Control (RBAC)**: Distinct permissions for `USER` and `ADMIN`.
- **Inventory Dashboard**: Users can view the vehicle catalog, search by make, filter by category, and simulate purchasing a car (which dynamically reduces stock).
- **Admin Panel**: Only accessible to admins. Allows full CRUD operations (Create, Read, Update, Delete) on the vehicle inventory.
- **Modern UI**: A custom Liquid Glass UI design featuring ambient orbs, glass panels, and responsive grid layouts.

## Tech Stack
- **Frontend**: React 19, Vite, Axios, React Router, Vitest (for testing).
- **Backend**: Java 21, Spring Boot 4.1.0, Spring Security, Spring Data JPA, JWT Authentication.
- **Database**: PostgreSQL 16 (via Docker).
- **Documentation**: Swagger OpenAPI 3.

---

## 🚀 Getting Started Locally

- Docker & Docker Compose
- ./env file for backend 

```bash
echo "JWT_SECRET=<jwt_secret>
JWT_EXPIRATION_MS=<expiration>" > .env
```

```bash
docker compose up --build
```

---

## 🧪 Testing and Coverage

This project was built using **Test-Driven Development (TDD)** (Red-Green-Refactor).

### Frontend Tests
Run Vitest to execute the frontend test suite:
```bash
cd frontend
npm test
```
**Generate Frontend Coverage Report**:
```bash
npm run coverage
```

### Backend Tests
Run Maven to execute the backend test suite:
```bash
cd backend
./mvnw test
```
**Generate Backend Coverage Report (JaCoCo)**:
```bash
./mvnw clean test jacoco:report
```
The JaCoCo HTML report will be generated at `backend/target/site/jacoco/index.html`.

---

**My AI usage**:
I have used Github copilot and antigravity to generate some of the code for frontend and backend, and to refactor the code, also have used claude for planing the project 


