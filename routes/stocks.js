const express = require('express');
const router = express.Router();
const db = require('../db');
const axios = require('axios');

const API_KEY = process.env.ALPHA_KEY || 'demo';

// 🧠 In-memory cache
const priceCache = new Map(); // { symbol: { price, timestamp } }
const CACHE_DURATION = 60 * 1000; // 60 seconds

const fetchCurrentPrice = async (symbol) => {
  const now = Date.now();
  const cached = priceCache.get(symbol);

  // ✅ Return cached price if it's recent
  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return cached.price;
  }

  try {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
    const response = await axios.get(url);
    const price = parseFloat(response.data['Global Quote']['05. price']);

    if (!isNaN(price)) {
      // ✅ Save to cache
      priceCache.set(symbol, { price, timestamp: now });
      return price;
    } else {
      console.warn(`No price for ${symbol}`);
      return null;
    }
  } catch (err) {
    console.error(`Error fetching price for ${symbol}:`, err.message);
    return null;
  }
};

// ✅ GET with live price + caching
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM stock');

    const withPrices = await Promise.all(
      rows.map(async (stock) => {
        const livePrice = await fetchCurrentPrice(stock.ticker);
        return {
          ...stock,
          currentPrice: livePrice || parseFloat(stock.buyPrice) + Math.random() * 100,
        };
      })
    );

    res.json(withPrices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST
router.post('/', async (req, res) => {
  const { stockName, ticker, buyPrice } = req.body;
  try {
    await db.query(
      'INSERT INTO stock (stockName, ticker, buyPrice) VALUES (?, ?, ?)',
      [stockName, ticker, buyPrice]
    );
    res.status(201).json({ message: 'Stock added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ PUT
router.put('/:id', async (req, res) => {
  const { stockName, ticker, buyPrice } = req.body;
  const { id } = req.params;
  try {
    await db.query(
      'UPDATE stock SET stockName = ?, ticker = ?, buyPrice = ? WHERE id = ?',
      [stockName, ticker, buyPrice, id]
    );
    res.json({ message: 'Stock updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM stock WHERE id = ?', [id]);
    res.json({ message: 'Stock deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/', async (req, res) => {
  try {
    console.log('✅ /api/stocks hit');
    const [rows] = await db.query('SELECT * FROM stock');
    console.log('✅ Fetched stocks:', rows);
    res.json(rows);
  } catch (err) {
    console.error('❌ DB Query Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
