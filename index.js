/**
 * Professional Chatbot - Server
 * - Express API that proxies requests to OpenAI
 * - Uses environment variable OPENAI_API_KEY
 * - Adds basic security headers and rate limiting
 */
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;
const OPENAI_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_KEY) {
  console.error('Missing OPENAI_API_KEY. Set it in your environment or .env file.');
  // do not exit; allow dev to set later
}

app.use(helmet());
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('tiny'));

// Basic rate limit
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 requests per windowMs
});
app.use('/api/', limiter);

// Simple health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Invalid message' });
    }

    const messages = [...history, { role: 'user', content: message }];

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 700,
        temperature: 0.2,
      })
    });

    const data = await resp.json();
    if (!resp.ok) {
      console.error('OpenAI error', data);
      return res.status(502).json({ error: 'Bad response from OpenAI', details: data });
    }

    const assistant = data.choices?.[0]?.message?.content || data.choices?.[0]?.text || '';
    res.json({ reply: assistant, raw: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Static serving for production (optional)
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html')));
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
