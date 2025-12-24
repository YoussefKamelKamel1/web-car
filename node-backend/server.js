const express = require('express');
const crypto = require('crypto');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Default allowlist includes common dev origins and the server origin so AdminJS assets
// served from this server are allowed in-browser during development.
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:5173,http://localhost:5000')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);


  const serverOrigin = `http://localhost:${PORT}`;
if (!allowedOrigins.includes(serverOrigin)) {
  allowedOrigins.push(serverOrigin);
}
console.log('CORS allowlist:', allowedOrigins);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., server-to-server, curl)
    if (!origin) return callback(null, true);

    // In development, be permissive to avoid blocking local tooling.
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[CORS] Development mode: allowing origin', origin);
      return callback(null, true);
    }

    // Allow explicit origins from the configured allowlist
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);

    // Allow common local loopback hostnames even if not enumerated
    try {
      const parsed = new URL(origin);
      if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
        return callback(null, true);
      }
    } catch (e) {
      // If the origin can't be parsed, fall through to block
    }

    console.warn('[CORS] Blocked origin:', origin);
    return callback(new Error('CORS policy: origin not allowed'), false);
  },
  credentials: true
}));
// Do NOT register global body parsers before AdminJS mounts its router.
// Instead, mount parsers only for our API routes so AdminJS `/admin` paths
// remain untouched by any body-parser-like middleware.
// Parsers will be applied to `/api/*` routes below (just before the API routes).

// Simple request logger
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl}`);
  next();
});

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'luxury_cars_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
pool.getConnection()
  .then(connection => {
    console.log('✅ Connected to MySQL database');
    connection.release();
    initDatabase();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err);
  });

// Initialize Database Tables
async function initDatabase() {
  try {
    const connection = await pool.getConnection();
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS test_drives (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        date DATE NOT NULL,
        time VARCHAR(50) NOT NULL,
        car_id INT,
        car_name VARCHAR(255) NOT NULL,
        message TEXT,
        status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_date (date),
        INDEX idx_status (status)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        phone VARCHAR(50),
        location VARCHAR(255),
        join_date DATE,
        bio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS cars (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        year INT NOT NULL,
        mileage VARCHAR(50),
        fuel VARCHAR(50),
        transmission VARCHAR(50),
        rating DECIMAL(2, 1) DEFAULT 0.0,
        reviews INT DEFAULT 0,
        description TEXT,
        features TEXT,
        images TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_price (price),
        INDEX idx_year (year)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS car_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        car_id INT NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        is_primary BOOLEAN DEFAULT FALSE,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
        INDEX idx_car_id (car_id)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_email VARCHAR(255) NOT NULL,
        car_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_favorite (user_email, car_id),
        INDEX idx_user_email (user_email)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        status ENUM('new', 'read', 'responded') DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_status (status)
      )
    `);

    const [cars] = await connection.query('SELECT COUNT(*) as count FROM cars');
    if (cars[0].count === 0) {
      await connection.query(`
        INSERT INTO cars (id, name, price, year, mileage, fuel, transmission, rating, reviews, description, features, images) VALUES
        (1, 'Mercedes-Benz S-Class', 89999.00, 2023, '5,000 mi', 'Gasoline', 'Automatic', 4.8, 124, 
         'Luxury sedan with cutting-edge technology', 
         'Navigation System,Leather Seats,Backup Camera,Bluetooth,Heated Seats,Sunroof,Parking Sensors,Premium Audio',
         'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1617531653520-bd788419a0a2?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=600&fit=crop'),
        
        (2, 'BMW X5', 67500.00, 2023, '8,200 mi', 'Hybrid', 'Automatic', 4.6, 89, 
         'Premium SUV with hybrid efficiency', 
         'Navigation System,Leather Seats,Backup Camera,Bluetooth,Heated Seats,Sunroof,Parking Sensors,Premium Audio',
         'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop'),
        
        (3, 'Audi A8', 79900.00, 2023, '3,500 mi', 'Gasoline', 'Automatic', 4.7, 156, 
         'Executive sedan with exceptional comfort', 
         'Navigation System,Leather Seats,Backup Camera,Bluetooth,Heated Seats,Sunroof,Parking Sensors,Premium Audio',
         'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642?w=800&h=600&fit=crop'),
        
        (4, 'Tesla Model S', 94990.00, 2024, '1,200 mi', 'Electric', 'Automatic', 4.9, 203, 
         'All-electric luxury sedan with autopilot', 
         'Autopilot,Navigation System,Premium Interior,Backup Camera,Bluetooth,Glass Roof,Premium Audio,Supercharger Access',
         'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&h=600&fit=crop'),
        
        (5, 'Porsche Cayenne', 82400.00, 2023, '6,800 mi', 'Gasoline', 'Automatic', 4.7, 178, 
         'Sports SUV with thrilling performance', 
         'Navigation System,Leather Seats,Backup Camera,Bluetooth,Heated Seats,Panoramic Roof,Parking Sensors,Bose Audio',
         'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&h=600&fit=crop'),
        
        (6, 'Range Rover Sport', 91500.00, 2023, '4,300 mi', 'Hybrid', 'Automatic', 4.8, 145, 
         'Luxury SUV with off-road capability', 
         'Navigation System,Leather Seats,Backup Camera,Bluetooth,Heated Seats,Panoramic Roof,Terrain Response,Meridian Audio',
         'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&h=600&fit=crop')
      `);
      
      const carImages = [
        { carId: 1, url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop', isPrimary: true, order: 0 },
        { carId: 1, url: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&h=600&fit=crop', isPrimary: false, order: 1 },
        { carId: 1, url: 'https://images.unsplash.com/photo-1617531653520-bd788419a0a2?w=800&h=600&fit=crop', isPrimary: false, order: 2 },
        { carId: 1, url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=600&fit=crop', isPrimary: false, order: 3 },
        { carId: 2, url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=600&fit=crop', isPrimary: true, order: 0 },
        { carId: 2, url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop', isPrimary: false, order: 1 },
        { carId: 3, url: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&h=600&fit=crop', isPrimary: true, order: 0 },
        { carId: 3, url: 'https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642?w=800&h=600&fit=crop', isPrimary: false, order: 1 },
        { carId: 4, url: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop', isPrimary: true, order: 0 },
        { carId: 4, url: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&h=600&fit=crop', isPrimary: false, order: 1 },
        { carId: 5, url: 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=800&h=600&fit=crop', isPrimary: true, order: 0 },
        { carId: 5, url: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&h=600&fit=crop', isPrimary: false, order: 1 },
        { carId: 6, url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop', isPrimary: true, order: 0 },
        { carId: 6, url: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&h=600&fit=crop', isPrimary: false, order: 1 }
      ];
      
      for (const img of carImages) {
        await connection.query(
          'INSERT INTO car_images (car_id, image_url, is_primary, display_order) VALUES (?, ?, ?, ?)',
          [img.carId, img.url, img.isPrimary, img.order]
        );
      }
      
      console.log('✅ Sample cars and images inserted');
    }

    connection.release();
    console.log('✅ Database tables initialized');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  }
}

// Apply body parsers for API routes only (keeps AdminJS routes parser-free)
app.use('/api', express.json(), express.urlencoded({ extended: true }));

// ===================== API ROUTES =====================

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// ===================== TEST DRIVES ROUTES =====================

app.post('/api/test-drives', async (req, res) => {
  try {
    const { name, email, phone, date, time, carId, carName, message } = req.body;

    if (!name || !email || !phone || !date || !time || !carName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    const [result] = await pool.query(
      `INSERT INTO test_drives (name, email, phone, date, time, car_id, car_name, message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone, date, time, carId || null, carName, message || null]
    );

    res.status(201).json({
      success: true,
      message: 'Test drive scheduled successfully',
      data: { id: result.insertId, name, email, phone, date, time, carName }
    });
  } catch (error) {
    console.error('Error scheduling test drive:', error);
    res.status(500).json({ success: false, message: 'Failed to schedule test drive' });
  }
});

app.get('/api/test-drives', async (req, res) => {
  try {
    const { status, date, email } = req.query;
    let query = 'SELECT * FROM test_drives WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    if (date) {
      query += ' AND date = ?';
      params.push(date);
    }
    if (email) {
      query += ' AND email = ?';
      params.push(email);
    }

    query += ' ORDER BY created_at DESC';
    const [results] = await pool.query(query, params);

    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    console.error('Error fetching test drives:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch test drives' });
  }
});

app.get('/api/test-drives/:id', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM test_drives WHERE id = ?', [req.params.id]);

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Test drive not found' });
    }

    res.json({ success: true, data: results[0] });
  } catch (error) {
    console.error('Error fetching test drive:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch test drive' });
  }
});

app.put('/api/test-drives/:id', async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const [result] = await pool.query(
      'UPDATE test_drives SET status = ? WHERE id = ?',
      [status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Test drive not found' });
    }

    res.json({ success: true, message: 'Test drive updated successfully' });
  } catch (error) {
    console.error('Error updating test drive:', error);
    res.status(500).json({ success: false, message: 'Failed to update test drive' });
  }
});

app.delete('/api/test-drives/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM test_drives WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Test drive not found' });
    }

    res.json({ success: true, message: 'Test drive deleted successfully' });
  } catch (error) {
    console.error('Error deleting test drive:', error);
    res.status(500).json({ success: false, message: 'Failed to delete test drive' });
  }
});

// ===================== CARS ROUTES =====================

app.get('/api/cars', async (req, res) => {
  try {
    const { make, year, minPrice, maxPrice, fuel } = req.query;
    let query = 'SELECT * FROM cars WHERE 1=1';
    const params = [];

    if (make) {
      query += ' AND name LIKE ?';
      params.push(`%${make}%`);
    }
    if (year) {
      query += ' AND year = ?';
      params.push(year);
    }
    if (minPrice) {
      query += ' AND price >= ?';
      params.push(minPrice);
    }
    if (maxPrice) {
      query += ' AND price <= ?';
      params.push(maxPrice);
    }
    if (fuel) {
      query += ' AND fuel = ?';
      params.push(fuel);
    }

    query += ' ORDER BY created_at DESC';
    const [results] = await pool.query(query, params);
    
    const carsWithImages = results.map(car => ({
      ...car,
      images: car.images ? car.images.split(',') : [],
      features: car.features ? car.features.split(',') : []
    }));

    res.json({ success: true, count: carsWithImages.length, data: carsWithImages });
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch cars' });
  }
});

app.get('/api/cars/:id', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM cars WHERE id = ?', [req.params.id]);

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    const car = results[0];
    const [images] = await pool.query(
      'SELECT image_url, is_primary, display_order FROM car_images WHERE car_id = ? ORDER BY display_order',
      [req.params.id]
    );

    car.images = car.images ? car.images.split(',') : images.map(img => img.image_url);
    car.features = car.features ? car.features.split(',') : [];
    car.imageDetails = images;

    res.json({ success: true, data: car });
  } catch (error) {
    console.error('Error fetching car:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch car' });
  }
});

// ===================== FAVORITES ROUTES =====================

app.post('/api/favorites', async (req, res) => {
  try {
    const { userEmail, carId } = req.body;

    if (!userEmail || !carId) {
      return res.status(400).json({ success: false, message: 'User email and car ID are required' });
    }

    await pool.query('INSERT INTO favorites (user_email, car_id) VALUES (?, ?)', [userEmail, carId]);
    res.status(201).json({ success: true, message: 'Car added to favorites' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'Car already in favorites' });
    }
    console.error('Error adding to favorites:', error);
    res.status(500).json({ success: false, message: 'Failed to add to favorites' });
  }
});

app.get('/api/favorites/:email', async (req, res) => {
  try {
    const [results] = await pool.query(
      `SELECT c.*, f.created_at as favorited_at 
       FROM favorites f 
       JOIN cars c ON f.car_id = c.id 
       WHERE f.user_email = ? 
       ORDER BY f.created_at DESC`,
      [req.params.email]
    );

    const favoritesWithImages = results.map(car => ({
      ...car,
      images: car.images ? car.images.split(',') : [],
      features: car.features ? car.features.split(',') : []
    }));

    res.json({ success: true, count: favoritesWithImages.length, data: favoritesWithImages });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch favorites' });
  }
});

app.delete('/api/favorites', async (req, res) => {
  try {
    const { userEmail, carId } = req.body;
    const [result] = await pool.query(
      'DELETE FROM favorites WHERE user_email = ? AND car_id = ?',
      [userEmail, carId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Favorite not found' });
    }

    res.json({ success: true, message: 'Car removed from favorites' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ success: false, message: 'Failed to remove favorite' });
  }
});

// ===================== CONTACT ROUTES =====================

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const [result] = await pool.query(
      'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)',
      [name, email, message]
    );

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Error submitting contact message:', error);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

app.get('/api/contact', async (req, res) => {
  try {
    const [results] = await pool.query(
      'SELECT * FROM contact_messages ORDER BY created_at DESC'
    );
    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
});

// ===================== USERS ROUTES =====================

app.post('/api/users', async (req, res) => {
  try {
    const { name, email, phone, location, bio } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    await pool.query(
      `INSERT INTO users (name, email, phone, location, bio, join_date)
       VALUES (?, ?, ?, ?, ?, CURDATE())
       ON DUPLICATE KEY UPDATE 
       name = VALUES(name),
       phone = VALUES(phone),
       location = VALUES(location),
       bio = VALUES(bio)`,
      [name, email, phone, location, bio]
    );

    res.status(201).json({
      success: true,
      message: 'User profile saved successfully',
      data: { name, email, phone, location, bio }
    });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ success: false, message: 'Failed to save user profile' });
  }
});

app.get('/api/users/:email', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM users WHERE email = ?', [req.params.email]);

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: results[0] });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user' });
  }
});

// ===================== STATISTICS ROUTES =====================

app.get('/api/statistics', async (req, res) => {
  try {
    const [testDrivesCount] = await pool.query(
      'SELECT COUNT(*) as count FROM test_drives WHERE status = "pending"'
    );
    const [carsCount] = await pool.query('SELECT COUNT(*) as count FROM cars');
    const [messagesCount] = await pool.query(
      'SELECT COUNT(*) as count FROM contact_messages WHERE status = "new"'
    );
    const [recentTestDrives] = await pool.query(
      'SELECT * FROM test_drives ORDER BY created_at DESC LIMIT 5'
    );

    res.json({
      success: true,
      data: {
        pendingTestDrives: testDrivesCount[0].count,
        totalCars: carsCount[0].count,
        newMessages: messagesCount[0].count,
        recentTestDrives: recentTestDrives
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch statistics' });
  }
});

// ===================== ADMINJS INITIALIZATION =====================

async function initializeAdmin() {
  try {
    const AdminJSMod = await import('adminjs');
    const AdminJSExpressMod = await import('@adminjs/express');

    const AdminJS = AdminJSMod.default || AdminJSMod;
    const AdminJSExpress = AdminJSExpressMod.default || AdminJSExpressMod;

    let sequelizeForAdmin = null;
    try {
      const SequelizeMod = await import('sequelize');
      const Sequelize = SequelizeMod.Sequelize || SequelizeMod.default || SequelizeMod;
      
      sequelizeForAdmin = new Sequelize(
        process.env.DB_NAME || 'luxury_cars_db',
        process.env.DB_USER || 'root',
        process.env.DB_PASSWORD || '1234',
        {
          host: process.env.DB_HOST || 'localhost',
          dialect: 'mysql',
          logging: (msg, timing) => {
            console.log('[Sequelize] ' + msg);
          },
          pool: { max: 5, min: 0, idle: 10000 }
        }
      );

      await sequelizeForAdmin.authenticate();
      console.log('✅ Sequelize (for AdminJS) connected');

      // Define Sequelize models matching the existing MySQL tables
      const { DataTypes } = await import('sequelize');

      const Car = sequelizeForAdmin.define('Car', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(255), allowNull: false },
        price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        year: { type: DataTypes.INTEGER, allowNull: false },
        mileage: { type: DataTypes.STRING(50) },
        fuel: { type: DataTypes.STRING(50) },
        transmission: { type: DataTypes.STRING(50) },
        rating: { type: DataTypes.DECIMAL(2, 1), defaultValue: 0.0 },
        reviews: { type: DataTypes.INTEGER, defaultValue: 0 },
        description: { type: DataTypes.TEXT },
        features: { type: DataTypes.TEXT },
        images: { type: DataTypes.TEXT },
        createdAt: { type: DataTypes.DATE, field: 'created_at', allowNull: false },
      }, { tableName: 'cars', timestamps: true, freezeTableName: true, underscored: true });

      const User = sequelizeForAdmin.define('User', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(255), allowNull: false },
        email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
        password: { type: DataTypes.STRING(255) },
        phone: { type: DataTypes.STRING(50) },
        location: { type: DataTypes.STRING(255) },
        join_date: { type: DataTypes.DATE, field: 'join_date' },
        bio: { type: DataTypes.TEXT },
        createdAt: { type: DataTypes.DATE, field: 'created_at', allowNull: false },
      }, { tableName: 'users', timestamps: true, freezeTableName: true, underscored: true });

      const TestDrive = sequelizeForAdmin.define('TestDrive', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(255), allowNull: false },
        email: { type: DataTypes.STRING(255), allowNull: false },
        phone: { type: DataTypes.STRING(50), allowNull: false },
        date: { type: DataTypes.DATE, allowNull: false },
        time: { type: DataTypes.STRING(50), allowNull: false },
        car_id: { type: DataTypes.INTEGER, field: 'car_id' },
        car_name: { type: DataTypes.STRING(255), allowNull: false, field: 'car_name' },
        message: { type: DataTypes.TEXT },
        status: { type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'), defaultValue: 'pending' },
        createdAt: { type: DataTypes.DATE, field: 'created_at', allowNull: false },
      }, { tableName: 'test_drives', timestamps: true, freezeTableName: true, underscored: true });

      const Favorite = sequelizeForAdmin.define('Favorite', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        user_email: { type: DataTypes.STRING(255), allowNull: false, field: 'user_email' },
        car_id: { type: DataTypes.INTEGER, allowNull: false, field: 'car_id' },
        createdAt: { type: DataTypes.DATE, field: 'created_at', allowNull: false },
      }, { tableName: 'favorites', timestamps: true, freezeTableName: true, underscored: true });

      const ContactMessage = sequelizeForAdmin.define('ContactMessage', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(255), allowNull: false },
        email: { type: DataTypes.STRING(255), allowNull: false },
        message: { type: DataTypes.TEXT, allowNull: false },
        status: { type: DataTypes.ENUM('new', 'read', 'responded'), defaultValue: 'new' },
        createdAt: { type: DataTypes.DATE, field: 'created_at', allowNull: false },
      }, { tableName: 'contact_messages', timestamps: true, freezeTableName: true, underscored: true });

      const CarImage = sequelizeForAdmin.define('CarImage', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        car_id: { type: DataTypes.INTEGER, allowNull: false, field: 'car_id' },
        image_url: { type: DataTypes.STRING(500), allowNull: false, field: 'image_url' },
        is_primary: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_primary' },
        display_order: { type: DataTypes.INTEGER, defaultValue: 0, field: 'display_order' },
        createdAt: { type: DataTypes.DATE, field: 'created_at', allowNull: false },
      }, { tableName: 'car_images', timestamps: true, freezeTableName: true, underscored: true });

      try {
        const AdminJSSequelizeMod = await import('@adminjs/sequelize');
        const AdminJSSequelize = AdminJSSequelizeMod.default || AdminJSSequelizeMod;
        AdminJS.registerAdapter(AdminJSSequelize);
      } catch (adapterErr) {
        console.warn('⚠️ AdminJS Sequelize adapter not available');
      }
    } catch (seqErr) {
      console.warn('⚠️ Sequelize not available for AdminJS');
      sequelizeForAdmin = null;
    }

    const adminJs = new AdminJS({
      databases: sequelizeForAdmin ? [sequelizeForAdmin] : [],
      rootPath: '/admin'
    });

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@aiu.edu';
    const adminPassword = process.env.ADMIN_PASSWORD || '1234';
    let cookiePassword = process.env.ADMIN_COOKIE_PASSWORD || process.env.ADMIN_COOKIE || 'change_this_secret';
    // AdminJS/express-session requires a cookiePassword of sufficient length (>=32).
    if (!cookiePassword || cookiePassword.length < 32) {
      const generated = crypto.randomBytes(32).toString('hex');
      console.warn('⚠️ ADMIN_COOKIE_PASSWORD is missing or too short. Generating a secure random cookie password for this run.');
      cookiePassword = generated;
    }

    const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
      adminJs,
      {
        authenticate: async (email, password) => {
          if (email === adminEmail && password === adminPassword) {
            return { email };
          }
          return null;
        },
        cookieName: 'adminjs',
        cookiePassword: cookiePassword
      },
      null,
      {
        resave: false,
        saveUninitialized: true
      }
    );

    app.use(adminJs.options.rootPath, adminRouter);
    console.log('✅ AdminJS initialized at', adminJs.options.rootPath);
    
  } catch (err) {
    console.error('❌ AdminJS initialization error:', err);
    console.error('Full error details:', JSON.stringify(err, null, 2));
    if (err.original) {
      console.error('Original DB error:', err.original);
    }
    console.error('Error stack:', err.stack);
    console.warn('⚠️ AdminJS not initialized:', err.message);
  }
}

// Initialize AdminJS before error handlers
initializeAdmin().then(() => {
  // Detailed error handler for AdminJS routes
  app.use('/admin', (err, req, res, next) => {
    console.error('❌ AdminJS Error:', err.message);
    if (err.original) {
      console.error('Database error:', err.original.message);
    }
    console.error('Full error:', err);
    next(err);
  });

  // Error handling middleware (must come after all routes)
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      message: 'Something went wrong!',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  });

  // 404 handler (must be last)
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: 'Route not found'
    }); 
  });

  // Start server
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔐 Admin panel: http://localhost:${PORT}/admin`);
  });
}).catch(err => {
  console.error('Failed to initialize admin:', err);
  
  // Start server anyway without AdminJS
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      message: 'Something went wrong!',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  });

  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: 'Route not found'
    });
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  });
});