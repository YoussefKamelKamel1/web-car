# Frontend-Backend Integration Guide

## ✅ Completed Integration

### Frontend Components Updated
1. **Hero.jsx** - "Schedule Test Drive" button wired to navigate to testdrive page
2. **ProductView.jsx** - "Schedule Test Drive" button wired to navigate to testdrive page with selected car
3. **TestDriveSchedule.jsx** - Already properly configured to POST to backend endpoint
4. **App.jsx** - TestDriveSchedule component integrated as a page route

### Backend API Endpoints Available
All endpoints are running on `http://localhost:5000`:

#### Test Drives
- `POST /api/test-drives` - Schedule a new test drive
- `GET /api/test-drives` - Get all test drives (with filters: status, date, email)
- `GET /api/test-drives/:id` - Get specific test drive
- `PUT /api/test-drives/:id` - Update test drive status
- `DELETE /api/test-drives/:id` - Delete test drive

#### Cars
- `GET /api/cars` - Get all cars (with filters: make, year, minPrice, maxPrice, fuel)
- `GET /api/cars/:id` - Get specific car with images

#### Users
- `POST /api/users` - Create/update user profile
- `GET /api/users/:email` - Get user by email

#### Favorites
- `POST /api/favorites` - Add car to favorites
- `GET /api/favorites/:email` - Get user's favorite cars
- `DELETE /api/favorites` - Remove car from favorites

#### Contact
- `POST /api/contact` - Submit contact message
- `GET /api/contact` - Get all contact messages

#### General
- `GET /api/health` - Health check
- `GET /api/statistics` - Dashboard statistics

## 🚀 Setup Instructions

### Backend Setup

1. **Install Dependencies** (Already Done)
   ```bash
   cd c:\projects\web\web_final\f\node-backend
   npm install
   ```

2. **Configure Database**
   - Install MySQL Server (if not already installed)
   - Update `.env` file with your MySQL credentials:
     ```dotenv
     PORT=5000
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_password
     DB_NAME=luxury_cars_db
     ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
     ```

3. **Start Backend Server**
   ```bash
   cd c:\projects\web\web_final\f\node-backend
   node server.js
   ```
   Expected output:
   ```
   ✅ Connected to MySQL database
   ✅ Database tables initialized
   ✅ Sample cars and images inserted
   🚀 Server running on port 5000
   ```

### Frontend Setup

1. **Install Dependencies** (Already Done)
   ```bash
   cd c:\projects\web\web_final\f\final
   npm install
   ```

2. **Start Frontend Dev Server**
   ```bash
   cd c:\projects\web\web_final\f\final
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

3. **Login**
   - Use any email to skip login and access the app

## 🔌 API Integration Flow

### Test Drive Booking Flow
1. User clicks "Schedule Test Drive" on Hero or ProductView page
2. Frontend navigates to testdrive page (`/testdrive`)
3. User fills out TestDriveSchedule form
4. Form data is POSTed to `http://localhost:5000/api/test-drives`
5. Backend validates data and inserts into `test_drives` table
6. User receives success confirmation and redirects to home

### Data Model

**Test Drive Record**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "(555) 123-4567",
  "date": "2025-12-25",
  "time": "10:00 AM",
  "car_id": 1,
  "car_name": "Mercedes-Benz S-Class",
  "message": "Optional special requests",
  "status": "pending",
  "created_at": "2025-12-24T10:00:00Z",
  "updated_at": "2025-12-24T10:00:00Z"
}
```

**Car Record**
```json
{
  "id": 1,
  "name": "Mercedes-Benz S-Class",
  "price": 89999.00,
  "year": 2023,
  "mileage": "5,000 mi",
  "fuel": "Gasoline",
  "transmission": "Automatic",
  "rating": 4.8,
  "reviews": 124,
  "images": ["https://..."],
  "features": "Navigation System,Leather Seats,..."
}
```

## 📝 Environment Variables

**Backend (.env)**
```dotenv
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=luxury_cars_db
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

## 🧪 Testing the Integration

### Test 1: Health Check
```bash
curl http://localhost:5000/api/health
```

### Test 2: Get All Cars
```bash
curl http://localhost:5000/api/cars
```

### Test 3: Schedule Test Drive
```bash
curl -X POST http://localhost:5000/api/test-drives \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "(555) 123-4567",
    "date": "2025-12-25",
    "time": "10:00 AM",
    "carId": 1,
    "carName": "Mercedes-Benz S-Class",
    "message": "Test booking"
  }'
```

## 🔐 CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:3000` (default React dev)
- `http://localhost:5173` (Vite dev)

To add more origins, update `ALLOWED_ORIGINS` in `.env`:
```dotenv
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://your-domain.com
```

## 📊 Database Schema

The backend automatically creates these tables on first run:
- `test_drives` - Test drive bookings
- `users` - User profiles
- `cars` - Car inventory
- `car_images` - Car images
- `favorites` - User favorite cars
- `contact_messages` - Contact form submissions

## 🐛 Troubleshooting

### "Database connection failed"
- Ensure MySQL Server is running
- Verify connection details in `.env`
- Check MySQL credentials

### "Module not found"
- Run `npm install` in both backend and frontend directories

### CORS Errors
- Check `ALLOWED_ORIGINS` in backend `.env`
- Ensure frontend is running on allowed port

### Port Already in Use
- Backend: Change `PORT` in `.env`
- Frontend: Vite will auto-select next available port

## ✨ Next Steps

- Set up database persistence with real MySQL instance
- Add authentication with JWT tokens
- Implement payment processing
- Add admin dashboard for managing test drives
- Set up email notifications for test drive confirmations
