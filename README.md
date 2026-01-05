# SpendWise - Personal Expense Tracker

SpendWise is a modern, full-stack expense tracking application designed to help users manage their finances effectively. Built with a robust Spring Boot backend and a dynamic React frontend, it offers a seamless experience for tracking expenses, managing budgets, and visualizing financial habits.

## 🚀 Features

### Core Features (Implemented)
- **User Authentication**: Secure JWT-based Sign Up and Sign In.
- **Expense Management**: Add, view, and delete daily expenses.
- **Visual Dashboard**: Interactive charts (Pie Chart) to visualize expense distribution by category.
- **Recent Activity**: detailed list of recent transactions.
- **Category Management**:
    - Automatic seeding of default categories (Food, Transportation, Utilities, etc.) upon registration.
    - Ability to manage custom categories.
- **Budgeting**: Backend support for setting monthly budgets.

### Technical Highlights
- **Backend**: Java Spring Boot with RESTful APIs.
- **Frontend**: React.js with Vite for fast performance.
- **Database**: PostgreSQL for reliable data persistence.
- **Security**: Spring Security with JWT (JSON Web Tokens).
- **Styling**: Modern UI with CSS animations and responsive design.

---

## 🛠️ Tech Stack

- **Backend**: Java 17+, Spring Boot 3, Spring Security, Spring Data JPA
- **Frontend**: React 18, Vite, Recharts (for visualization), Lucide React (icons)
- **Database**: PostgreSQL
- **Build Tools**: Maven (Backend), NPM (Frontend)

---

## ⚙️ Setup Instructions

### Prerequisites
- JDK 17 or later
- Node.js and npm
- PostgreSQL installed and running

### 1. Database Setup
Create a PostgreSQL database named `postgres` (or update `application.properties`):
```sql
CREATE DATABASE postgres;
```
*Note: The application is configured to use the default `postgres` database with username `postgres` and password `Lokesh@123`. Update `backend/src/main/resources/application.properties` if your credentials differ.*

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Build the project:
   ```bash
   mvn clean install
   ```
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```
   The backend API will start at `http://localhost:8080`.

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signin` - Login user
- `POST /api/auth/signup` - Register new user

### Expenses
- `GET /api/expenses` - Get all expenses for current user
- `POST /api/expenses` - Create a new expense
- `DELETE /api/expenses/{id}` - Delete an expense

### Categories
- `GET /api/categories` - Get user categories
- `POST /api/categories` - Create a new category

### Budgets
- `GET /api/budgets?month={yyyy-mm}` - Get monthly budget
- `POST /api/budgets` - Set/Update budget

---

## 🔮 Future Roadmap (Currently Missing/Incomplete)
- **Edit Expenses**: Current implementation only allows Adding and Deleting.
- **Budget UI**: The Dashboard displays a hardcoded budget target (`2000.00`). Connecting the UI to the existing Backend Budget API is a planned improvement.
- **Advanced Filtering**: Date range filtering for reports.
