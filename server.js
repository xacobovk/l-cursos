const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = 'your_secret_key';

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'cursos'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Register user
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  db.query(query, [name, email, hashedPassword], (err, result) => {
    if (err) {
      return res.status(400).send('Error registering user');
    }
    res.status(201).send('User registered');
  });
});

// Login user
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).send('User not found');
    }
    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send('Invalid password');
    }
    const token = jwt.sign({ userId: user.id }, SECRET_KEY);
    res.send({ token });
  });
});

// Add course to cart
app.post('/api/cart', (req, res) => {
  const { token, courseId } = req.body;
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const query = 'INSERT INTO cart (user_id, course_id) VALUES (?, ?)';
    db.query(query, [decoded.userId, courseId], (err, result) => {
      if (err) {
        return res.status(400).send('Error adding course to cart');
      }
      res.send('Course added to cart');
    });
  } catch (error) {
    res.status(401).send('Unauthorized');
  }
});

// Get user cart
app.get('/api/cart', (req, res) => {
  const { token } = req.headers;
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const query = `
      SELECT courses.title, courses.price
      FROM cart
      JOIN courses ON cart.course_id = courses.id
      WHERE cart.user_id = ?
    `;
    db.query(query, [decoded.userId], (err, results) => {
      if (err) {
        return res.status(400).send('Error fetching cart');
      }
      res.send(results);
    });
  } catch (error) {
    res.status(401).send('Unauthorized');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});