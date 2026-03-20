# CartIQ 🛒⚡
### Smart Budget. Smarter Cart.

> An AI-powered e-commerce platform that auto-generates optimized shopping carts based on user budget using a custom value-scoring (IQ) algorithm.

---



- Node.js v18+
- MongoDB running locally OR a MongoDB Atlas URI

---

### 1. Backend Setup

```bash
cd cartiq-backend
npm install

# Create your .env file
cp .env.example .env
# Edit .env → add your MONGO_URI if using Atlas

# Seed the database with 40+ products
npm run seed

# Start the backend server
npm run dev
```
Backend runs at: **http://localhost:5000**

---

### 2. Frontend Setup

```bash
cd cartiq-frontend
npm install

# Start the dev server
npm run dev
```
Frontend runs at: **http://localhost:3000**

---

## 📁 Project Structure

```
cartiq/
├── cartiq-backend/
│   ├── server.js              # Express entry point
│   ├── models/Product.js      # MongoDB schema + IQ score pre-hook
│   ├── routes/
│   │   ├── products.js
│   │   └── cart.js
│   ├── controllers/
│   │   ├── productController.js
│   │   └── cartController.js  ← The star: CartIQ algorithm
│   └── seed/seed.js           # 40+ sample products
│
└── cartiq-frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx        # Budget input + category
    │   │   ├── Results.jsx     # Generated smart cart
    │   │   ├── Bundles.jsx     # Preset budget bundles
    │   │   ├── Compare.jsx     # Side-by-side comparison
    │   │   └── ProductDetail.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ProductCard.jsx
    │   │   ├── CartStats.jsx
    │   │   ├── IQBadge.jsx
    │   │   └── Loader.jsx
    │   └── api/index.js        # Axios API calls
    └── vite.config.js          # Proxy → backend
```

---

## 🧠 The CartIQ Algorithm

```js
// IQ Score = value for money, higher is better
iqScore = (rating × log(reviews + 1)) / price × 10000

// Greedy cart optimization:
// 1. Filter products by category + budget
// 2. Sort by IQ Score (best value first)
// 3. Add items until budget is exhausted
// 4. Return cart + stats (savings, IQ score, remaining budget)
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/cart/generate` | Generate smart cart `{ budget, category }` |
| GET | `/api/products` | Get all products (filter by category, price) |
| GET | `/api/products/:id` | Get product + similar items |
| GET | `/api/products/categories` | Get all categories |

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Routing | React Router v6 |
| HTTP | Axios |
| Deploy | Vercel (frontend) + Render (backend) |

---

## 📦 Deploy

**Frontend → Vercel**
```bash
cd cartiq-frontend
npm run build
# Upload dist/ to Vercel or use Vercel CLI
```

**Backend → Render**
- Create a new Web Service on render.com
- Set `MONGO_URI` environment variable (use MongoDB Atlas)
- Build command: `npm install`
- Start command: `npm start`

---

Built with ❤️ for portfolio purposes
