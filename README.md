# Restaurant POS & Order Management System

A starter full-stack application for the UrsTech SDE assignment.

## Stack
- Frontend: Next.js App Router + React
- Backend: Node.js + Express
- Database: MongoDB / MongoDB Atlas
- Authentication: JWT, bcrypt password hashing, Admin/Staff role middleware

## Requirements
- Node.js LTS
- MongoDB local server OR MongoDB Atlas connection string

## 1. Start backend
```bash
cd backend
npm install
```
Copy `.env.example` to `.env`, then update `MONGODB_URI` and `JWT_SECRET`.

Windows PowerShell:
```powershell
Copy-Item .env.example .env
```

Start API:
```bash
npm run dev
```
API health check: http://localhost:5000/api/health

## 2. Start frontend
Open a second VS Code terminal:
```bash
cd frontend
npm install
```
Copy `.env.local.example` to `.env.local`.

Windows PowerShell:
```powershell
Copy-Item .env.local.example .env.local
```

Run frontend:
```bash
npm run dev
```
Open http://localhost:3000

## 3. First login
1. Open http://localhost:3000/login
2. Select “First time? Set up the first Admin”.
3. Enter a name, email and password of at least 8 characters.
4. Switch to Login and sign in.
5. Add menu items, then create orders and record payments.

The setup-admin endpoint only works when the database contains no users. For a public production deployment, remove or disable this endpoint after creating the first admin.

## API endpoints
- `POST /api/auth/setup-admin` — one-time first admin setup
- `POST /api/auth/login`
- `GET /api/menu` — authenticated; supports `search`, `category`, `includeUnavailable=true`
- `POST /api/menu` — Admin only
- `PUT /api/menu/:id` — Admin only
- `GET /api/orders`
- `POST /api/orders`
- `PATCH /api/orders/:id/status`
- `POST /api/orders/:id/payment`
- `GET /api/reports/daily-sales`

## Important implementation notes
- Server calculates prices, tax, discount and totals from database menu prices.
- Unavailable menu items cannot be added to a new order.
- Status progression is validated by the backend.
- This starter is a foundation, not a claim of full production readiness. Before final submission, add staff-user creation, tests, improved order search, input/schema validation, and deployment-specific security settings.
