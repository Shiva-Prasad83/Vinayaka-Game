require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const helmet    = require('helmet');
const morgan    = require('morgan');
const mongoose  = require('mongoose');
const http      = require('http');
const { Server } = require('socket.io');

const progressRoutes = require('./routes/progress');

const app    = express();
const server = http.createServer(app);

// ── CORS ─────────────────────────────────────────────────────────────────────
// Allow multiple origins: localhost for dev + the Vercel domain(s) for prod.
// CLIENT_URL can be a single URL or a comma-separated list:
//   CLIENT_URL=https://ganesha-festival.vercel.app,https://www.yourdomain.com
const rawOrigins = process.env.CLIENT_URL || 'http://localhost:5173';
const allowedOrigins = rawOrigins
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no Origin header (server-to-server, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Allow any *.vercel.app preview-deployment URL automatically
    if (/https:\/\/[a-zA-Z0-9-]+(\.vercel\.app)$/.test(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// ── Socket.IO ─────────────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: corsOptions.origin,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors(corsOptions));
app.options('/{*wildcard}', cors(corsOptions));   // handle pre-flight requests (Express 5 syntax)
app.use(express.json({ limit: '10kb' }));
// Use 'combined' format in production for structured logs, 'dev' locally
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/progress', progressRoutes);

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Ganesha Festival API is running 🐘',
    time:    new Date(),
    env:     process.env.NODE_ENV || 'development',
  });
});

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ── Socket events ─────────────────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

// ── DB + Start ────────────────────────────────────────────────────────────────
const PORT      = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ganesha-festival';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    server.listen(PORT, '0.0.0.0', () =>
      console.log(`🐘 Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`)
    );
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    console.log('⚠️  Starting in offline mode (localStorage fallback active for clients)');
    server.listen(PORT, '0.0.0.0', () =>
      console.log(`🐘 Server running on port ${PORT} (no DB)`)
    );
  });

module.exports = { app, io };
