const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json({ limit: '10mb' }));

// CORS configuration
const clientUrl = process.env.CLIENT_URL;
const allowedOrigins = clientUrl
  ? [clientUrl, 'http://localhost:5173', 'http://localhost:3000']
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      // In production (same origin) or local dev
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'production') {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

// In production, serve the built React client from Express
if (process.env.NODE_ENV === 'production') {
  const clientDistPath = path.resolve(__dirname, '../client/dist');
  app.use(express.static(clientDistPath));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(clientDistPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
