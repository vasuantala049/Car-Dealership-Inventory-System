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

### Prerequisites
- Java 21
- Node.js 18+
- Docker & Docker Compose

### 1. Database Setup
Start the PostgreSQL database using Docker Compose:
```bash
docker-compose up -d
```

### 2. Backend Setup
Navigate to the `backend` directory and start the Spring Boot server:
```bash
cd backend
./mvnw spring-boot:run
```
The backend will run on `http://localhost:8080`.

### 3. Frontend Setup
Navigate to the `frontend` directory, install dependencies, and start the Vite dev server:
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:5173`. 
*Note: Vite is configured to proxy API requests to `localhost:8080`.*

---

## 📖 API Documentation (Swagger)

Once the backend is running, you can interact with the API endpoints via the Swagger UI:
- **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI JSON**: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

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

## ☁️ Deployment Instructions (EC2 & Docker)

You can easily deploy this application to an AWS EC2 instance using Docker.

### 1. Prepare the EC2 Instance
1. Launch an Amazon Linux 2 or Ubuntu EC2 instance.
2. Open ports `80` (HTTP) and `22` (SSH) in the Security Group.
3. SSH into the instance and install Docker and Docker Compose.

### 2. Prepare the Application for Production
1. **Frontend Build**: Build the production bundle for the frontend:
   ```bash
   cd frontend
   npm run build
   ```
   This will generate static files in the `dist` directory.
2. **Backend Build**: Package the Spring Boot application into a `.jar`:
   ```bash
   cd backend
   ./mvnw clean package -DskipTests
   ```

### 3. Deploy via Docker Compose
Create a `docker-compose.prod.yml` file on your EC2 instance. You will use an Nginx container to serve the compiled frontend `dist` files and proxy `/api` requests to the Spring Boot backend container, alongside a PostgreSQL container.

1. Clone your repository onto the EC2 instance.
2. Run `docker-compose -f docker-compose.prod.yml up -d --build`.
3. Your application will now be live on your EC2's Public IP address!
