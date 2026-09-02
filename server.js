import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());

  // --- MySQL Database Connection Pool ---
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hoomaninneed',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  // --- API ROUTES ---

  // USERS API
  app.post('/api/users', async (req, res) => {
    const { uid, email, name, role } = req.body;
    
    if (!uid || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const [existingUsers] = await pool.query('SELECT * FROM users WHERE firebase_uid = ?', [uid]);
      
      if (existingUsers.length > 0) {
        const existingUser = existingUsers[0];
        
        if (name && name !== 'User' && existingUser.name === 'User') {
          await pool.query('UPDATE users SET name = ? WHERE id = ?', [name, existingUser.id]);
          existingUser.name = name;
        }

        if (role && role !== existingUser.role) {
          await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, existingUser.id]);
          existingUser.role = role;
        }
        
        return res.json({
          id: existingUser.id,
          firebase_uid: uid,
          email: existingUser.email,
          name: existingUser.name,
          role: existingUser.role
        });
      }
      
      const insertRole = role || 'donor';
      const [result] = await pool.query(
        'INSERT INTO users (firebase_uid, name, email, role) VALUES (?, ?, ?, ?)',
        [uid, name || 'User', email, insertRole]
      );
      
      res.json({
        id: result.insertId,
        firebase_uid: uid,
        email,
        name: name || 'User',
        role: insertRole
      });
    } catch (error) {
      console.error('Error in /api/users:', error);
      res.status(500).json({ error: 'Database error while saving user' });
    }
  });

  // GET user by firebase_uid
  app.get('/api/users/:uid', async (req, res) => {
    const { uid } = req.params;
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE firebase_uid = ?', [uid]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(rows[0]);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });

  // DONATIONS API: Create a new donation
  app.post('/api/donations', async (req, res) => {
    try {
      const { 
        firebaseUid, 
        foodName, 
        category, 
        description, 
        quantity, 
        unit, 
        ingredients, 
        allergens, 
        pickupDeadline, 
        pickupLocation, 
        safetyNotes 
      } = req.body;

      const [users] = await pool.query('SELECT id FROM users WHERE firebase_uid = ?', [firebaseUid]);
      if (users.length === 0) {
        return res.status(404).json({ error: 'User not found in MySQL' });
      }
      const donorId = users[0].id;

      const formattedDeadline = pickupDeadline ? pickupDeadline.replace('T', ' ') : null;
      const safeAllergens = allergens ? JSON.stringify(allergens) : '[]';

      const [result] = await pool.query(
        `INSERT INTO donations 
        (donor_id, food_name, category, description, quantity, unit, ingredients, allergens, pickup_deadline, location, safety_notes, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'available')`,
        [donorId, foodName, category, description || '', quantity, unit, ingredients || '', safeAllergens, formattedDeadline, pickupLocation, safetyNotes || '']
      );

      res.status(201).json({ id: result.insertId, message: 'Donation created successfully' });
    } catch (error) {
      console.error('Error creating donation:', error);
      res.status(500).json({ error: 'Database error', details: error.message });
    }
  });

  // DONATIONS API: Cancel a donation
  app.put('/api/donations/:id/cancel', async (req, res) => {
    try {
      const { id } = req.params;
      await pool.query('UPDATE donations SET status = "cancelled" WHERE id = ?', [id]);
      res.json({ message: 'Donation cancelled' });
    } catch (error) {
      console.error('Error cancelling donation:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });

  // DONATIONS API: Get all active donations
  app.get('/api/donations', async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT 
          d.id, d.donor_id as donorId, d.food_name as foodName, 
          d.category, d.description, d.quantity, d.unit, 
          d.ingredients, d.allergens, d.pickup_deadline as pickupDeadline, 
          d.location as pickupLocation, d.safety_notes as safetyNotes, 
          d.status, d.created_at as createdAt,
          u.name as donorName
        FROM donations d
        LEFT JOIN users u ON d.donor_id = u.id
        WHERE d.status = "available" ORDER BY d.created_at DESC
      `);
      res.json(rows);
    } catch (error) {
      console.error('Error fetching donations:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });

  // DONATIONS API: Get donations for a specific donor by their Firebase UID
  // FIXED: Removed d.status != 'completed' filter so stats are calculated properly
  app.get('/api/donations/donor/:uid', async (req, res) => {
    try {
      const { uid } = req.params;
      const [rows] = await pool.query(`
        SELECT 
          d.id, d.donor_id as donorId, d.food_name as foodName, 
          d.category, d.description, d.quantity, d.unit, 
          d.ingredients, d.allergens, d.pickup_deadline as pickupDeadline, 
          d.location as pickupLocation, d.safety_notes as safetyNotes, 
          d.status, d.created_at as createdAt,
          c.name as collectorName
        FROM donations d
        JOIN users u ON d.donor_id = u.id
        LEFT JOIN tasks t ON d.id = t.donation_id
        LEFT JOIN users c ON t.volunteer_id = c.id
        WHERE u.firebase_uid = ? AND d.status != 'cancelled'
        ORDER BY d.created_at DESC
      `, [uid]);
      res.json(rows);
    } catch (error) {
      console.error('Error fetching donor donations:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });

  // DONATIONS API: Book a donation
  app.post('/api/donations/:id/book', async (req, res) => {
    try {
      const { id } = req.params;
      const { firebaseUid } = req.body;
      
      const [users] = await pool.query('SELECT id FROM users WHERE firebase_uid = ?', [firebaseUid]);
      if (users.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      const collectorId = users[0].id;

      await pool.query('UPDATE donations SET status = "accepted" WHERE id = ?', [id]);
      await pool.query(
        'INSERT INTO tasks (donation_id, volunteer_id, status) VALUES (?, ?, "accepted") ON DUPLICATE KEY UPDATE status="accepted"',
        [id, collectorId]
      );
      
      res.json({ message: 'Donation booked' });
    } catch (error) {
      console.error('Error booking donation:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });

  // DONATIONS API: Complete a booked donation
  app.post('/api/donations/:id/complete', async (req, res) => {
    try {
      const { id } = req.params;
      
      await pool.query('UPDATE donations SET status = "completed" WHERE id = ?', [id]);
      await pool.query(
        'UPDATE tasks SET status = "completed", completed_at = CURRENT_TIMESTAMP WHERE donation_id = ?',
        [id]
      );
      
      res.json({ message: 'Donation completed' });
    } catch (error) {
      console.error('Error completing donation:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });

  // DONATIONS API: Get active booked donations for collector
  app.get('/api/donations/collector/:uid/active', async (req, res) => {
    try {
      const { uid } = req.params;
      const [rows] = await pool.query(`
        SELECT 
          d.id, d.food_name as foodName, d.category, d.description, d.quantity, d.unit, 
          d.ingredients, d.allergens, d.pickup_deadline as pickupDeadline, 
          d.location as pickupLocation, d.safety_notes as safetyNotes, 
          d.status, d.created_at as createdAt,
          u.name as donorName
        FROM tasks t
        JOIN donations d ON t.donation_id = d.id
        JOIN users c ON t.volunteer_id = c.id
        JOIN users u ON d.donor_id = u.id
        WHERE c.firebase_uid = ? AND d.status = 'accepted'
        ORDER BY t.created_at DESC
      `, [uid]);
      res.json(rows);
    } catch (error) {
      console.error('Error fetching collector active tasks:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });

  // DONATIONS API: Get history for donor
  app.get('/api/donations/donor/:uid/history', async (req, res) => {
    try {
      const { uid } = req.params;
      const [rows] = await pool.query(`
        SELECT 
          d.id, d.food_name as foodName, d.status, d.created_at as createdAt,
          c.name as collectorName
        FROM donations d
        JOIN users u ON d.donor_id = u.id
        LEFT JOIN tasks t ON d.id = t.donation_id
        LEFT JOIN users c ON t.volunteer_id = c.id
        WHERE u.firebase_uid = ? AND d.status = 'completed'
        ORDER BY d.created_at DESC
      `, [uid]);
      res.json(rows);
    } catch (error) {
      console.error('Error fetching donor history:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });

  // DONATIONS API: Get history for collector
  app.get('/api/donations/collector/:uid/history', async (req, res) => {
    try {
      const { uid } = req.params;
      const [rows] = await pool.query(`
        SELECT 
          d.id, d.food_name as foodName, d.status, d.created_at as createdAt,
          u.name as donorName
        FROM tasks t
        JOIN donations d ON t.donation_id = d.id
        JOIN users c ON t.volunteer_id = c.id
        JOIN users u ON d.donor_id = u.id
        WHERE c.firebase_uid = ? AND d.status = 'completed'
        ORDER BY t.completed_at DESC
      `, [uid]);
      res.json(rows);
    } catch (error) {
      console.error('Error fetching collector history:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });

  // TASKS API: Get tasks
  app.get('/api/tasks', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
      res.json(rows);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});