# LuxuryCars - Backend API Server

A robust Node.js/Express backend server providing a complete REST API for the LuxuryCars luxury car dealership platform. Handles user management, inventory, test drive bookings, favorites, and customer support communications.

## 📋 Project Overview

The backend serves as the central hub for the LuxuryCars application, managing all data persistence, business logic, and API endpoints. It supports:
- User authentication and profile management
- Car inventory with filtering and search
- Test drive booking system
- User favorites/saved vehicles
- Contact form and chat support
- CORS configuration for frontend integration
- MySQL database operations

## 🚀 Technologies Used

### Core Stack
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework for API endpoints
- **MySQL** - Relational database for persistent storage
- **mysql2/promise** - MySQL client with promise support
- **dotenv** - Environment variable management
- **nodemon** - Development server with auto-reload

### Key Dependencies
```json
{
  "express": "^4.18.2",
  "mysql2": "^3.5.2",
  "dotenv": "^16.3.1",
  "nodemon": "^3.0.1",
  "cors": "^2.8.5"
}
```

## 🏗️ System Architecture & Data Flow

### Server Startup Flow
```
node server.js
  ↓
Load environment variables (.env)
  ↓
Connect to MySQL database
  ↓
Create tables (if not exist)
  ↓
Start Express server on port 5000
  ↓
Ready for client connections
```

### Request Handling Flow
```
Client Request
  ↓
CORS Validation
  ↓
Route Matching
  ↓
Data Validation
  ↓
Database Query
  ↓
JSON Response
```

### Database Tables & Relationships

#### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password VARCHAR(255),
  phone VARCHAR(20),
  location VARCHAR(255),
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

#### Cars Table
```sql
CREATE TABLE cars (
  id INT AUTO_INCREMENT PRIMARY KEY,
  make VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INT,
  price INT,
  mileage INT,
  transmission VARCHAR(50),
  fuel_type VARCHAR(50),
  rating DECIMAL(3, 2),
  features VARCHAR(500),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

#### Car Images Table
```sql
CREATE TABLE car_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  car_id INT NOT NULL,
  image_url VARCHAR(500),
  FOREIGN KEY (car_id) REFERENCES cars(id)
)
```

#### Test Drives Table
```sql
CREATE TABLE test_drives (
  id INT AUTO_INCREMENT PRIMARY KEY,
  car_id INT,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  test_drive_date DATE,
  test_drive_time VARCHAR(50),
  special_requests TEXT,
  status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

#### Favorites Table
```sql
CREATE TABLE favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_email VARCHAR(255),
  car_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_favorite (user_email, car_id)
)
```

#### Contact Messages Table
```sql
CREATE TABLE contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  message TEXT,
  status ENUM('new', 'read', 'responded') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

## 📁 Project Structure

```
node-backend/
├── server.js              # Main Express server
├── .env                   # Environment variables
├── .env.example           # Example environment file
├── package.json           # Dependencies & scripts
├── package-lock.json      # Dependency lock file
└── README.md             # This file
```

## 🔌 API Endpoints

### Health Check
- `GET /api/health` - Returns server status

### Authentication & Users
- `POST /api/users` - Create or update user profile
  ```json
  Body: {
    "email": "user@example.com",
    "name": "John Doe",
    "password": "password123",
    "phone": "555-1234",
    "location": "New York",
    "bio": "Luxury car enthusiast"
  }
  ```
  
- `GET /api/users/:email` - Get user profile by email
  ```
  Response: User object with profile data
  ```

### Cars & Inventory
- `GET /api/cars` - Get all cars with optional filters
  ```
  Query params:
  - make: string (Mercedes, BMW, Audi, Tesla)
  - year: number (2024, 2023, 2022)
  - minPrice: number (price in $)
  - maxPrice: number (price in $)
  - fuelType: string (Electric, Petrol, Diesel)
  ```
  
- `GET /api/cars/:id` - Get car by ID with images
  ```
  Response: Car object with image array
  ```

### Test Drives
- `POST /api/test-drives` - Schedule test drive
  ```json
  Body: {
    "car_id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-1234",
    "test_drive_date": "2025-12-25",
    "test_drive_time": "14:00",
    "special_requests": "Need wheelchair accessibility"
  }
  ```
  
- `GET /api/test-drives` - Get all test drives

### Favorites
- `POST /api/favorites` - Add car to favorites
  ```json
  Body: {
    "user_email": "user@example.com",
    "car_id": 1
  }
  ```
  
- `GET /api/favorites/:email` - Get user's favorite cars
  ```
  Response: Array of favorite car IDs
  ```
  
- `DELETE /api/favorites` - Remove from favorites
  ```json
  Body: {
    "user_email": "user@example.com",
    "car_id": 1
  }
  ```

### Contact & Messages
- `POST /api/contact` - Submit contact/chat message
  ```json
  Body: {
    "name": "John Doe",
    "email": "john@example.com",
    "message": "I have a question about the car..."
  }
  ```
  
- `GET /api/contact` - Get all contact messages

## 🚦 Getting Started

### Prerequisites
- Node.js (v14+)
- MySQL server running and accessible
- npm or yarn

### Installation

1. **Navigate to backend directory**
```bash
cd c:\projects\web\web_final\f\node-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file** (copy from `.env.example`)
```bash
cp .env.example .env
```

4. **Configure environment variables** in `.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=luxurycars_db
DB_PORT=3306
PORT=5000
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
NODE_ENV=development
```

### Start Development Server

```bash
npm run dev
```

Or for production:

```bash
node server.js
```

Server will start on `http://localhost:5000`

### Build Sample Data

On first run, the server automatically:
1. Creates all database tables if they don't exist
2. Inserts 6 sample luxury cars with images
3. Initializes the database schema

## 🧪 Testing Endpoints

### Using curl (PowerShell)

```powershell
# Get all cars
curl http://localhost:5000/api/cars

# Get cars with filter
curl "http://localhost:5000/api/cars?make=Mercedes&year=2024"

# Create user
curl -X POST http://localhost:5000/api/users `
  -H "Content-Type: application/json" `
  -d '{"email":"test@example.com","name":"Test User"}'

# Schedule test drive
curl -X POST http://localhost:5000/api/test-drives `
  -H "Content-Type: application/json" `
  -d '{"car_id":1,"name":"John","email":"john@example.com","phone":"555-1234","test_drive_date":"2025-12-25","test_drive_time":"14:00"}'

# Add to favorites
curl -X POST http://localhost:5000/api/favorites `
  -H "Content-Type: application/json" `
  -d '{"user_email":"test@example.com","car_id":1}'
```

### Using Postman

1. Import endpoints into Postman
2. Set base URL: `http://localhost:5000`
3. Test each endpoint with sample data

## 🔧 Configuration

### CORS Settings
The server accepts requests from:
- http://localhost:5173 (default frontend dev server)
- http://localhost:3000 (alternative frontend)
- Requests without origin (curl, Postman)

To add more origins, update `ALLOWED_ORIGINS` in `.env`

### Database Connection
Uses MySQL connection pool with `mysql2/promise`:
- Supports multiple concurrent connections
- Automatic connection retry
- Promise-based async queries

### Error Handling
- Try-catch blocks on all endpoints
- 500 error responses for database failures
- 400 error responses for validation failures
- CORS error handling with proper headers

## 📊 Sample Data

The server initializes with 6 luxury vehicles:
1. Mercedes-Benz S-Class (2024) - $95,000
2. BMW 7 Series (2024) - $85,000
3. Audi A8 (2023) - $80,000
4. Tesla Model S (2024) - $90,000
5. Porsche 911 (2024) - $110,000
6. Range Rover (2023) - $100,000

Each car includes:
- Multiple high-quality images
- Detailed specifications
- Features list
- User rating

## 🎯 Key Features

- ✅ RESTful API design
- ✅ CORS enabled for frontend integration
- ✅ MySQL database persistence
- ✅ Automatic table creation on startup
- ✅ Sample data initialization
- ✅ Async/await error handling
- ✅ Environment variable configuration
- ✅ Hot reload with nodemon
- ✅ Query parameter filtering
- ✅ Unique constraints on favorites

## 🚀 Performance Considerations

- Connection pooling with MySQL
- Indexed queries on frequently accessed fields
- Async operations prevent blocking
- Lightweight JSON responses
- Efficient SQL queries

## 🔐 Security Notes

**Current Implementation:**
- Basic email-based authentication (no passwords hashed)
- No JWT tokens
- CORS validation
- Input validation on some endpoints

**Production Recommendations:**
- Implement bcrypt password hashing
- Add JWT authentication tokens
- Validate all input data
- Implement rate limiting
- Add HTTPS support
- Use environment-based secrets
- Add request logging
- Implement data sanitization

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| DB_HOST | MySQL server host | localhost |
| DB_USER | MySQL username | root |
| DB_PASSWORD | MySQL password | password123 |
| DB_NAME | Database name | luxurycars_db |
| DB_PORT | MySQL port | 3306 |
| PORT | Server port | 5000 |
| ALLOWED_ORIGINS | CORS allowed origins | http://localhost:5173 |
| NODE_ENV | Environment | development |

## 🐛 Troubleshooting

### MySQL Connection Error
```
Error: Access denied for user 'root'
```
**Solution:** Check DB_PASSWORD in .env, verify MySQL is running

### CORS Error from Frontend
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution:** Add frontend URL to ALLOWED_ORIGINS in .env

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Kill existing process or change PORT in .env

### Tables Not Creating
```
Error: Table 'cars' doesn't exist
```
**Solution:** Check MySQL user has CREATE permission, restart server

## 📚 API Documentation

Full API documentation with examples available at `/api/docs` (if swagger is added)

## 🤝 Contributing

When modifying the API:
1. Update endpoints in server.js
2. Keep RESTful principles
3. Maintain consistent response format
4. Add validation for user input
5. Update this README with changes

## 📄 License

This project is part of the LuxuryCars platform. All rights reserved.

---

**Last Updated:** December 24, 2025
**Version:** 1.0.0
**Server Port:** 5000
**Database:** MySQL
