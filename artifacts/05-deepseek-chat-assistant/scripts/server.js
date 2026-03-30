import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../config/.env') });

const app = express();
const staticDir = path.resolve(__dirname, '../app');

const {
  PORT = 4173,
  DIFY_API_KEY,
  DIFY_API_URL = 'http://localhost/v1/chat-messages'
} = process.env;

if (!DIFY_API_KEY) {
  console.warn('[DeepSeek Assistant] Missing DIFY_API_KEY. Set it in config/.env.');
}

app.use(express.json());
app.use(express.static(staticDir));

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body || {};
    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const difyResponse = await fetch(DIFY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DIFY_API_KEY}`
      },
      body: JSON.stringify({
        inputs: {},
        query: message,
        response_mode: 'blocking'
      })
    });

    if (!difyResponse.ok) {
      const errorText = await difyResponse.text();
      return res.status(502).json({
        error: 'Dify returned an error.',
        details: errorText
      });
    }

    const data = await difyResponse.json();
    return res.json({
      output: data?.answer ?? data,
      metadata: {
        id: data?.id,
        created_at: data?.created_at
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to reach Dify.', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`DeepSeek assistant UI running at http://localhost:${PORT}`);
});
