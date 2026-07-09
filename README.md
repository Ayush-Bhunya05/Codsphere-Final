# 🎓 CodeSphere - Institution Management System

A full-stack web application built with **React**, **Node.js**, and **PostgreSQL** for comprehensive institution management. CodeSphere streamlines administrative tasks, user authentication, and data management for educational institutions.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Key Features & Functionality](#key-features--functionality)
- [Database](#database)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

- **🔐 User Authentication**: Secure JWT-based authentication with role-based access control
- **👥 Admin Dashboard**: Comprehensive administrative interface for managing users and institution data
- **📊 Analytics & Reporting**: Real-time data visualization with Chart.js
- **📤 Bulk Data Import**: CSV/Excel file upload support for batch operations
- **🔒 Security Features**: Bcrypt password hashing, rate limiting, helmet.js for HTTP headers
- **📱 Responsive UI**: Modern React frontend with intuitive user experience
- **⚡ RESTful API**: Well-structured backend API with proper error handling
- **🐳 Docker Support**: Easy deployment with Docker and Docker Compose

---

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0** - UI library
- **React Router DOM 7.9.3** - Client-side routing
- **Axios 1.12.2** - HTTP client
- **Chart.js 4.5.0** - Data visualization
- **React-ChartJS-2 5.3.0** - React wrapper for Chart.js

### Backend
- **Node.js** - Runtime environment
- **Express 4.18.2** - Web framework
- **PostgreSQL 8.16.3** - Database
- **JWT (jsonwebtoken 9.0.2)** - Authentication
- **Bcrypt 5.1.1** - Password hashing
- **CORS 2.8.5** - Cross-origin requests
- **Helmet 8.1.0** - Security middleware
- **Express Rate Limit 8.1.0** - API rate limiting
- **Multer 2.0.2** - File uploads
- **csv-parser 3.2.0** - CSV parsing
- **XLSX 0.18.5** - Excel file handling

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

---

## 📁 Project Structure

```
Codsphere-Final/
├── frontend/                 # React frontend application
│   ├── src/                 # Source files
│   ├── public/              # Static assets
│   ├── package.json         # Frontend dependencies
│   └── README.md            # Frontend documentation
│
├── backend/                 # Node.js backend API
│   ├── routes/              # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   └── admin/          # Admin management endpoints
│   ├── models/             # Database models
│   ├── middleware/         # Custom middleware
│   ├── controllers/        # Business logic
│   ├── server.js          # Express server setup
│   ├── package.json       # Backend dependencies
│   └── README.md          # Backend documentation
│
├── database/               # Database configurations & migrations
│   └── schema.sql         # Database schema
│
├── docker-compose.yml     # Docker Compose configuration
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- **Node.js** (v14 or higher)
- **npm** or **yarn** (Node package manager)
- **PostgreSQL** (v12 or higher)
- **Git**
- **Docker & Docker Compose** (optional, for containerized deployment)

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Ayush-Bhunya05/Codsphere-Final.git
cd Codsphere-Final
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## 🔧 Environment Setup

### Backend Configuration

Create a `.env` file in the `backend/` directory based on `.env.example`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=codesphere

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### Frontend Configuration

Create a `.env` file in the `frontend/` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## ▶️ Running the Application

### Option 1: Local Development (Without Docker)

#### Start the Backend Server

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:5000`

#### Start the Frontend Development Server (in a new terminal)

```bash
cd frontend
npm start
```

The frontend will open on `http://localhost:3000`

### Option 2: Using Docker Compose

```bash
docker-compose up --build
```

This will start both frontend and backend services along with the PostgreSQL database.

---

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /login` - User login with credentials
- `POST /register` - User registration
- `POST /logout` - User logout
- `GET /verify` - Verify JWT token
- `POST /refresh-token` - Refresh authentication token

### Admin Routes (`/api/admin`)

- `GET /dashboard` - Get dashboard analytics
- `GET /users` - List all users
- `POST /users` - Create new user
- `PUT /users/:id` - Update user information
- `DELETE /users/:id` - Delete user
- `POST /import` - Bulk import users (CSV/Excel)
- `GET /reports` - Generate reports

### Health Check

- `GET /api/health` - API health status

---

## 🎯 Key Features & Functionality

### Authentication & Authorization
- Secure JWT-based authentication system
- Role-based access control (Admin, User, etc.)
- Password encryption with bcrypt
- Token refresh mechanism for enhanced security

### Admin Dashboard
- User management interface
- Real-time analytics and statistics
- Data visualization with interactive charts
- Bulk operations support

### Data Management
- CSV/Excel file import functionality
- Data validation and error handling
- Secure file upload with multer
- Batch operations support

### API Security
- Rate limiting to prevent abuse
- CORS protection
- Helmet.js for HTTP security headers
- Input validation and sanitization

---

## 🗄️ Database

The application uses **PostgreSQL** for data persistence.

### Database Setup

1. Create a PostgreSQL database:

```bash
createdb codesphere
```

2. Run migrations:

```bash
psql -U postgres -d codesphere -f database/schema.sql
```

### Database Schema

The database includes tables for:
- Users (authentication, profiles)
- Admin records
- Institutions
- Roles and permissions
- Audit logs

---

## 🔐 Security

This application implements industry-standard security practices:

✅ **JWT Authentication** - Stateless, token-based authentication  
✅ **Password Hashing** - Bcrypt with salt rounds  
✅ **Rate Limiting** - Prevents brute force and DoS attacks  
✅ **CORS Protection** - Whitelist-based cross-origin requests  
✅ **Helmet.js** - Sets security HTTP headers  
✅ **Input Validation** - Server-side validation of all inputs  
✅ **HTTPS Ready** - Environment-based SSL configuration  

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

---

## 📈 Performance Optimizations

- Optimized database queries with proper indexing
- Frontend code splitting and lazy loading
- Efficient state management
- Caching strategies for API responses
- Compressed static assets

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

---

## 📞 Support & Contact

For questions or issues, please open an issue on GitHub or contact the repository owner.

- **GitHub**: [@Ayush-Bhunya05](https://github.com/Ayush-Bhunya05)
- **Repository**: [Codsphere-Final](https://github.com/Ayush-Bhunya05/Codsphere-Final)

---

## 🎉 Acknowledgments

- Built with modern web technologies
- Inspired by best practices in full-stack development
- Special thanks to all contributors and supporters

---

**Made with ❤️ by Ayush Bhunya**
