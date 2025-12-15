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

## Architecture & Design

This project follows a **Layered Architecture** pattern with clean separation of concerns and dependency injection.

### Architectural Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        HTTP Request                          │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Routes Layer                             │
│  • Express Router                                            │
│  • Route definitions                                         │
│  • Request mapping to controllers                            │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Controller Layer                           │
│  • HTTP request/response handling                            │
│  • Input validation & parsing                                │
│  • Response formatting                                       │
│  • Error handling (delegates to middleware)                  │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Service Layer                             │
│  • Business logic                                            │
│  • Data orchestration                                        │
│  • Transaction coordination                                  │
│  • Data transformation                                       │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Repository Layer                            │
│  • Database abstraction                                      │
│  • Query construction                                        │
│  • Data access operations (CRUD)                             │
│  • Database-specific logic                                   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Model Layer                              │
│  • Sequelize ORM models                                      │
│  • Schema definitions                                        │
│  • Relationships & associations                              │
│  • Data validation rules                                     │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   PostgreSQL Database                         │
└─────────────────────────────────────────────────────────────┘
```

### Layer Responsibilities

#### 1. **Routes Layer** (`src/routes/`)
- **Purpose**: Define API endpoints and map them to controller methods
- **Responsibilities**:
  - Route registration
  - HTTP method mapping (GET, POST, PUT, DELETE)
  - Path parameter definitions
  - Route grouping and organization

```

#### 2. **Controller Layer** (`src/controllers/`)
- **Purpose**: Handle HTTP concerns and orchestrate service calls
- **Responsibilities**:
  - Request parameter extraction
  - Input validation and parsing
  - Service method invocation
  - Response formatting (JSON)
  - HTTP status code management
  - Error delegation to middleware

```

**Key Principle**: Controllers should be thin - no business logic, only request/response handling.

#### 3. **Service Layer** (`src/services/`)
- **Purpose**: Implement business logic and coordinate operations
- **Responsibilities**:
  - Business rule implementation
  - Data validation and transformation
  - Orchestrating multiple repository calls
  - Transaction management
  - Complex data aggregation
  - Business workflow coordination

```

**Key Principle**: Services contain all business logic and are framework-agnostic (no HTTP concerns).

#### 4. **Repository Layer** (`src/repositories/`)
- **Purpose**: Abstract database operations and provide data access interface
- **Responsibilities**:
  - CRUD operations (Create, Read, Update, Delete)
  - Query construction and optimization
  - Database-specific logic
  - Data filtering and sorting
  - Pagination implementation
  - Relationship loading (eager/lazy)
```

**Key Principle**: Repositories isolate database concerns and can be easily mocked for testing.

#### 5. **Model Layer** (`src/models/`)
- **Purpose**: Define data structure and ORM mappings
- **Responsibilities**:
  - Table schema definition
  - Column types and constraints
  - Model relationships and associations
  - Data validation rules
  - Default values
  - Hooks (beforeCreate, afterUpdate, etc.)

**Example:**
```javascript
export default (sequelize) => {
  const Company = sequelize.define('Company', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    spendLimit: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    // ...
  });

  // Define relationships
  Company.hasMany(Card, { foreignKey: 'companyId' });
  
  return Company;
};
```

### Design Patterns

#### 1. **Dependency Injection (DI)**
All layers use constructor-based dependency injection for loose coupling and testability.

```javascript
class DashboardService {
  constructor(companyRepo, transactionRepo, cardRepo, invoiceRepo) {
    this.companyRepository = companyRepo;
    this.transactionRepository = transactionRepo;
    this.cardRepository = cardRepo;
    this.invoiceRepository = invoiceRepo;
  }
}

// Inject dependencies
const service = new DashboardService(
  companyRepository,
  transactionRepository,
  cardRepository,
  invoiceRepository
);
```

**Benefits:**
- Easy to mock dependencies in tests
- Loose coupling between components
- Better testability and maintainability
- Clear declaration of dependencies

#### 2. **Repository Pattern**
Abstracts data access logic and provides a collection-like interface.

```javascript
class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findById(id) { /* ... */ }
  async findAll(options) { /* ... */ }
  async create(data) { /* ... */ }
  async update(id, data) { /* ... */ }
  async delete(id) { /* ... */ }
}
```

**Benefits:**
- Centralizes data access logic
- Easy to switch database implementations
- Simplifies testing with mock repositories
- Reduces code duplication

#### 3. **Service Layer Pattern**
Encapsulates business logic separate from HTTP and data access concerns.

**Benefits:**
- Business logic is reusable across different interfaces (REST, GraphQL, CLI)
- Easy to test business rules in isolation
- Clear separation of concerns
- Framework-agnostic business logic

**Benefits:**
- Encapsulates object creation logic
- Provides flexibility in object instantiation
- Centralizes initialization code

#### 5. **Middleware Pattern**
Express middleware for cross-cutting concerns.

```javascript
app.use(express.json());
app.use(cors());
app.use('/api', routes);
app.use(errorHandler);
```

**Benefits:**
- Modular request processing
- Reusable functionality
- Clean separation of concerns

### Data Flow Example

Let's trace a request through the architecture:

```
1. HTTP GET /api/companies/550e8400.../dashboard
   ↓
2. Routes Layer: Matches route and calls controller
   ↓
3. Controller: Extracts companyId from params
   ↓
4. Service: Orchestrates multiple repository calls
   ├─→ CompanyRepository.findById()
   ├─→ CompanyRepository.getRemainingSpend()
   ├─→ TransactionRepository.getLatestTransactions()
   ├─→ CardRepository.getCardsByCompany()
   └─→ InvoiceRepository.getUpcomingInvoices()
   ↓
5. Repositories: Query database via Sequelize models
   ↓
6. Models: Execute SQL queries via ORM
   ↓
7. PostgreSQL: Return data
   ↓
8. Service: Transform and aggregate data
   ↓
9. Controller: Format response as JSON
   ↓
10. HTTP Response: { success: true, data: {...} }
```

### Testing Strategy

The architecture enables comprehensive testing at each layer:

#### **Unit Tests**
- **Service Layer**: Mock repositories, test business logic
- **Controller Layer**: Mock services, test HTTP handling
- **Repository Layer**: Mock database, test query logic

#### **Integration Tests**
- Test complete request/response cycle
- Use real database (test environment)
- Verify API contracts

```javascript
// Service test with mocked repositories
const mockRepo = {
  findById: mock.fn(async () => ({ id: '123', name: 'Test' }))
};
const service = new DashboardService(mockRepo, ...);

// Integration test with real HTTP
const response = await fetch('http://localhost:3000/api/companies/123/dashboard');
```

### Configuration Management

Environment-specific configurations are managed through:
- `.env` files for development
- `.env.test` for testing
- Environment variables for production

```javascript
// database.js (ES Modules for app)
export default {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    // ...
  }
};

// database.cjs (CommonJS for Sequelize CLI)
module.exports = {
  development: { /* ... */ }
};
```

### Error Handling

Centralized error handling through middleware:

```javascript
// In controllers
try {
  const data = await this.service.method();
  res.json({ success: true, data });
} catch (error) {
  next(error); // Delegate to error middleware
}

// In error middleware
app.use((error, req, res, next) => {
  res.status(500).json({
    success: false,
    message: error.message
  });
});
```

### Advantages of This Architecture

1. **Separation of Concerns**: Each layer has a single, well-defined responsibility
2. **Testability**: Easy to test each layer in isolation with dependency injection
3. **Maintainability**: Changes in one layer don't ripple through others
4. **Scalability**: Easy to add new features or modify existing ones
5. **Reusability**: Business logic in services can be reused across different interfaces
6. **Database Agnostic**: Repository pattern allows easy database switching
7. **Type Safety**: Clear interfaces between layers
8. **Error Handling**: Centralized and consistent error management

### Trade-offs

**Pros:**
- High maintainability and testability
- Clear code organization
- Easy to onboard new developers
- Follows industry best practices

**Cons:**
- More boilerplate code than simpler architectures
- Learning curve for developers new to layered architecture
- Potentially over-engineered for very simple applications

## Database Schema

### Entity Relationship Diagram

```
┌─────────────────────────┐
│       Companies         │
├─────────────────────────┤
│ id (UUID) PK            │
│ name (VARCHAR)          │
│ spendLimit (DECIMAL)    │
│ currentSpend (DECIMAL)  │
│ currency (VARCHAR)      │
│ createdAt (TIMESTAMP)   │
│ updatedAt (TIMESTAMP)   │
└──────────┬──────────────┘
           │
           │ 1:N
           │
    ┌──────┴──────┬──────────────┬──────────────┐
    │             │              │              │
    │             │              │              │
┌───▼────────┐ ┌─▼──────────┐ ┌─▼──────────┐    │
│   Cards    │ │Transactions│ │  Invoices  │    │
├────────────┤ ├────────────┤ ├────────────┤    │
│ id PK      │ │ id PK      │ │ id PK      │    │
│ companyId FK│ │companyId FK│ │companyId FK│   │
│ cardNumber │ │ cardId FK  │ │invoiceNumber│   │
│ holderName │ │ amount     │ │ amount     │    │
│ expiryDate │ │ currency   │ │ currency   │    │
│ cardImage  │ │ description│ │ dueDate    │    │
│ isActive   │ │ merchant   │ │ status     │    │
│ status     │ │ category   │ │ description│    │
│ createdAt  │ │ transDate  │ │ createdAt  │    │
│ updatedAt  │ │ status     │ │ updatedAt  │    │
└────────────┘ │ createdAt  │ └────────────┘    │
               │ updatedAt  │                   │
               └────────────┘                   │
                     │                          │
                     │                          │
                     └──────────────────────────┘
                           N:1
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
      "cardHolderName": "John Doe",
      "expiryDate": "2025-12-31",
      "status": "inactive",
      "isActive": false
    },
    "latestTransactions": [
      {
        "id": "770e8400-e29b-41d4-a716-446655440001",
        "description": "Office Supplies",
        "amount": 450.50,
        "currency": "SEK",
        "date": "2024-12-14T10:30:00.000Z"
      },
      {
        "id": "770e8400-e29b-41d4-a716-446655440002",
        "description": "Software Subscription",
        "amount": 299.00,
        "currency": "SEK",
        "date": "2024-12-13T14:22:00.000Z"
      },
      {
        "id": "770e8400-e29b-41d4-a716-446655440003",
        "description": "Client Lunch Meeting",
        "amount": 850.00,
        "currency": "SEK",
        "date": "2024-12-12T12:15:00.000Z"
      }
    ],
    "invoices": [
      {
        "id": "880e8400-e29b-41d4-a716-446655440001",
        "invoiceNumber": "INV-2024-001",
        "amount": 5000.00,
        "currency": "SEK",
        "dueDate": "2024-12-20",
        "status": "pending"
      }
    ]
  }
}
```

### Response for Get Transactions (Paginated)

```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "770e8400-e29b-41d4-a716-446655440001",
        "description": "Office Supplies",
        "amount": 450.50,
        "currency": "SEK",
        "date": "2024-12-14T10:30:00.000Z",
        "status": "completed"
      },
      {
        "id": "770e8400-e29b-41d4-a716-446655440002",
        "description": "Software Subscription",
        "amount": 299.00,
        "currency": "SEK",
        "date": "2024-12-13T14:22:00.000Z",
        "status": "completed"
      },
      {
        "id": "770e8400-e29b-41d4-a716-446655440003",
        "description": "Client Lunch Meeting",
        "amount": 850.00,
        "currency": "SEK",
        "date": "2024-12-12T12:15:00.000Z",
        "status": "completed"
      },
      {
        "id": "770e8400-e29b-41d4-a716-446655440004",
        "description": "Marketing Campaign",
        "amount": 1200.00,
        "currency": "SEK",
        "date": "2024-12-11T09:45:00.000Z",
        "status": "completed"
      },
      {
        "id": "770e8400-e29b-41d4-a716-446655440005",
        "description": "Cloud Hosting",
        "amount": 675.00,
        "currency": "SEK",
        "date": "2024-12-10T16:20:00.000Z",
        "status": "completed"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 63,
      "totalPages": 7
    }
  }
}
```

### Response for Activate Card

```json
{
  "success": true,
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "companyId": "550e8400-e29b-41d4-a716-446655440000",
    "cardNumber": "**** **** **** 1234",
    "cardHolderName": "John Doe",
    "expiryDate": "2025-12-31",
    "cardImage": "https://example.com/cards/card-image.png",
    "isActive": true,
    "status": "active",
    "createdAt": "2024-12-01T10:00:00.000Z",
    "updatedAt": "2024-12-15T14:30:00.000Z"
  },
  "message": "Card activated successfully"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Company not found"
}
```

```json
{
  "success": false,
  "message": "Card not found"
}
```
