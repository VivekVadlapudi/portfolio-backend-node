
---

## 📁 `portfolio-backend-node/README.md`

```markdown
# ⚙️ Portfolio Tracker – Backend (Node.js + Express)

This is the **backend API** for the Portfolio Tracker app.  
It handles routes for managing stock data, connects to a MySQL database, and uses the Alpha Vantage API to fetch real-time prices.

## 🌐 Hosted API

🔗 [Live on Railway](https://your-backend-api.up.railway.app/api/stocks)

---

## 🔧 Tech Stack

- Node.js
- Express.js
- MySQL (Railway-hosted)
- Axios (for external API)
- dotenv (for env vars)
- CORS

---

## 🔁 API Endpoints

| Method | Endpoint               | Description           |
|--------|------------------------|-----------------------|
| GET    | `/api/stocks`          | Fetch all stocks      |
| POST   | `/api/stocks`          | Add a new stock       |
| PUT    | `/api/stocks/:id`      | Update a stock        |
| DELETE | `/api/stocks/:id`      | Delete a stock        |

---

## 🧪 Setup Locally

```bash
git clone https://github.com/VivekVadlapudi/portfolio-backend-node.git
cd portfolio-backend-node
npm install
npm run dev

🔐 Environment Variables (.env)
DB_HOST=your_mysql_host
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=railway
DB_PORT=your_mysql_port
ALPHA_KEY=your_alpha_vantage_key

🧠 Database Table Schema
CREATE TABLE stock (
  id INT AUTO_INCREMENT PRIMARY KEY,
  stockName VARCHAR(100),
  ticker VARCHAR(10),
  buyPrice DECIMAL(10, 2),
  currentPrice DECIMAL(10, 2)
);
