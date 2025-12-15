# Dashboard API

A REST API for managing company dashboards with cards, transactions, and invoices.

## Prerequisites

- Node.js 25+
- Docker & Docker Compose

## Quick Start

1. **Clone and install dependencies**
   ```bash
   npm install
   ```

2. **Start PostgreSQL with Docker**
   ```bash
   npm run docker:up
   ```

3. **Run migrations and seed data**
   ```bash
   npm run migrate
   npm run seed
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

Or use the setup command to do everything at once:
```bash
npm run setup
```

## Test Data

After seeding, you'll have:
- **Company**: Mytestcompany (ID: `550e8400-e29b-41d4-a716-446655440000`)
- **Cards**: 2 cards (1 active, 1 inactive)
- **Transactions**: 60+ transactions across different categories
- **Invoices**: 5 invoices (3 pending, 1 paid, 1 overdue)

## Available Services

- **API**: http://localhost:3000
- **PgAdmin**: http://localhost:5050
  - Email: admin@admin.com
  - Password: admin

## API Endpoints

### Get Dashboard Data
```http
GET /api/companies/550e8400-e29b-41d4-a716-446655440000/dashboard
```

### Activate Card
```http
POST /api/cards/660e8400-e29b-41d4-a716-446655440000/activate
```

### Get Transactions (Paginated)
```http
GET /api/companies/550e8400-e29b-41d4-a716-446655440000/transactions?page=1&limit=10
```

## Example Response

```json
{
  "success": true,
  "data": {
    "company": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Mytestcompany"
    },
    "remainingSpend": {
      "currentSpend": 5400,
      "spendLimit": 10000,
      "remaining": 4600,
      "currency": "SEK"
    },
    "card": {
      "id": "660e8400-e29b-41d4-a716-446655440000",
      "cardNumber": "**** **** **** 1234",
      "status": "inactive"
    },
    "latestTransactions": [...],
    "invoices": [...]
  }
}
```

## Docker Commands

- Start services: `npm run docker:up`
- Stop services: `npm run docker:down`
- View logs: `npm run docker:logs`
- Reset database: `npm run docker:reset`

## Database Scripts

- Run migrations: `npm run migrate`
- Undo migrations: `npm run migrate:undo`
- Seed database: `npm run seed`
- Undo seeds: `npm run seed:undo`

## Project Structure

```
Dashboard/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   └── dashboard.controller.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── company.model.js
│   │   ├── card.model.js
│   │   ├── transaction.model.js
│   │   ├── invoice.model.js
│   │   └── index.js
│   ├── repositories/
│   │   ├── base.repository.js
│   │   ├── company.repository.js
│   │   ├── card.repository.js
│   │   ├── transaction.repository.js
│   │   └── invoice.repository.js
│   ├── routes/
│   │   ├── dashboard.routes.js
│   │   └── index.js
│   ├── services/
│   │   └── dashboard.service.js
│   └── index.js
├── migrations/
├── seeders/
├── docker-compose.yml
├── .env
└── README.md
```