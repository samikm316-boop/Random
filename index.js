require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const homeRoutes = require('./routes/homeRoutes');
const studyRoutes = require('./routes/studyRoutes');
const practiceRoutes = require('./routes/practiceRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Main App Routes
app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/study', studyRoutes);
app.use('/api/practice', practiceRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Focus Plus API is running successfully' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
