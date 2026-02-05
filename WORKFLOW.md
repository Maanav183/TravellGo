# Travellgo - Development Workflow

This document outlines the steps to set up, run, and develop the **Travellgo** Tour and Travel Management System.

## Prerequisites

Ensure you have the following installed on your local machine:

-   **Java Development Kit (JDK) 21**: Required for the Spring Boot backend.
-   **Node.js & npm**: Required for the React frontend (Node.js 18+ recommended).
-   **Maven**: For building the backend (optional if using `mvnw` wrapper).
-   **MySQL Server**: Database for the application.
-   **IDE**: IntelliJ IDEA (recommended for Backend) and VS Code (recommended for Frontend).

---

## 1. Database Setup

1.  Install and start your MySQL server.
2.  Create a new database named `travellgo` (or as configured in `application.properties`).
    ```sql
    CREATE DATABASE travellgo;
    ```
3.  Ensure your database username and password match the configuration in `Backend-travelGO/src/main/resources/application.properties`.

---

## 2. Backend Setup (Spring Boot)

The backend is located in the `Backend-travelGO` directory.

### Configuration
1.  Navigate to `Backend-travelGO/src/main/resources/application.properties`.
2.  Update the database credentials if necessary:
    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/travellgo
    spring.datasource.username=your_username
    spring.datasource.password=your_password
    ```
3.  Configure Razorpay and Email credentials if you want to test payments and email notifications.

### Running the Backend
1.  Open a terminal and navigate to the backend directory:
    ```bash
    cd Backend-travelGO
    ```
2.  Run the application using the Maven wrapper:
    -   **Windows**:
        ```powershell
        ./mvnw spring-boot:run
        ```
    -   **Linux/Mac**:
        ```bash
        ./mvnw spring-boot:run
        ```
3.  The backend server will start at `http://localhost:8080`.
4.  **Swagger API Documentation**: Once running, access the API docs at `http://localhost:8080/swagger-ui/index.html`.

---

## 3. Frontend Setup (React + Vite)

The frontend is located in the `TravelGO-frontend` directory.

### Installation
1.  Open a new terminal and navigate to the frontend directory:
    ```bash
    cd TravelGO-frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Frontend
1.  Start the development server:
    ```bash
    npm run dev
    ```
2.  The application will be accessible at `http://localhost:5173` (or the port shown in the terminal).

### Build for Production
To create a production build:
```bash
npm run build
```
Preview the build locally:
```bash
npm run preview
```

---

## Common Workflow

1.  **Start Database**: Ensure MySQL is running.
2.  **Start Backend**: Run the Spring Boot app.
3.  **Start Frontend**: Run `npm run dev` for the React app.
4.  **Development**:
    -   Changes in **Backend** (Java) will trigger a restart if DevTools is active (or manual restart).
    -   Changes in **Frontend** (React) are instantly reflected via Vite's HMR (Hot Module Replacement).

## Troubleshooting

-   **Backend Port Conflict**: If port 8080 is in use, change `server.port` in `application.properties` or kill the process using that port.
-   **CORS Issues**: If the frontend cannot communicate with the backend, check the `@CrossOrigin` annotations in your Backend Controllers or global CORS configuration.
-   **Database Connection**: Double-check connection URL, username, and password. Ensure the MySQL service is running.
