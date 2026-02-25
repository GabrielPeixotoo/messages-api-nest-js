# Messages API

A modern REST API built with **NestJS** for sending and managing messages between users. It includes JWT authentication, profile picture upload, and email notifications. Suitable for internal announcements, notifications, or simple messaging flows (one sender, multiple recipients, read receipts).

---

## Project overview

This API lets authenticated users **send messages to one or more recipients** and tracks read status per recipient. It is **notification/broadcast-style** rather than chat: each message is a standalone send with a list of receivers and an `isRead` flag per receiver (no conversation threads or reply chains).

**Domain modules:**

- **Auth** — Login, JWT (access + refresh), route protection, and route policies.
- **Users** — CRUD, profile picture upload, and ownership rules (users can only update/delete their own data).
- **Messages** — Create, list (paginated), get, update, and delete messages; one sender, many receivers; read status stored in a join table.

**Architecture:**

- **Modular NestJS:** Controllers → Services → TypeORM entities; dependency injection; domain modules (Auth, Users, Messages, Email).
- **Cross-cutting:** Global validation pipe (DTOs + class-validator), guards (JWT + route policy), interceptors (timing, headers), throttler (rate limit). Config loaded by environment (`.env.development`, `.env.production`, `.env.test`) and validated with Joi.
- **Database:** PostgreSQL with TypeORM. Three main entities: `users`, `messages`, and `message_receivers` (join table between message and users for recipients + `isRead` per recipient).

---

## Tech stack

| Area | Technology |
|------|------------|
| Runtime | Node.js 20+ |
| Language | TypeScript (strict mode) |
| Framework | [NestJS](https://nestjs.com/) |
| ORM | [TypeORM](https://typeorm.io/) |
| Database | [PostgreSQL](https://www.postgresql.org/) |
| Auth | [JWT](https://jwt.io/) (access + refresh) |
| Validation | [class-validator](https://github.com/class-validator/class-validator) + DTOs |
| Docs | [Swagger](https://swagger.io/) (OpenAPI) |
| Security | [Helmet](https://helmetjs.github.io/), [Throttler](https://docs.nestjs.com/security/rate-limiting), bcrypt |
| Email | [Nodemailer](https://nodemailer.com/) |
| Tests | Jest, Supertest (unit + E2E) |

---

## Features

### Authentication
- Login with email and password
- JWT access and refresh tokens
- Token refresh endpoint
- Guards for protected routes
- Route policies (extensible for future RBAC)

### Users
- Sign up and list users
- Get user by ID (authenticated)
- Update and delete own profile
- Profile picture upload (PNG, max 10MB)
- Input validation via DTOs

### Messages
- Send a message to multiple recipients
- Paginated message list
- Get, update, and delete own messages
- Sender and recipients modeled via `messages` + `message_receivers` (read status per recipient)

### Email
- Nodemailer integration
- Optional email notifications (e.g. when a message is sent)

### Security
- Rate limiting (10 requests per minute, configurable)
- Helmet for secure HTTP headers (production)
- CORS configurable per environment
- bcrypt password hashing
- Input validation and parameter pipes
- SQL injection mitigation via TypeORM parameterized queries

### Documentation
- Swagger UI at `/docs`
- Bearer token auth in Swagger
- Request/response schemas for main endpoints

---

## Prerequisites

- Node.js 20+ ([nvm](https://github.com/nvm-sh/nvm) recommended)
- PostgreSQL 12+
- npm or yarn

---

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/nest_messages_api.git
   cd nest_messages_api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL**
   ```sql
   CREATE USER your_user WITH ENCRYPTED PASSWORD 'your_password';
   CREATE DATABASE your_database WITH OWNER your_user;
   GRANT ALL PRIVILEGES ON DATABASE your_database TO your_user;
   ```

4. **Environment variables**

   Create `.env.development` in the project root:

   ```env
   # Database
   DATABASE_TYPE=postgres
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USERNAME=your_user
   DATABASE=your_database
   DATABASE_PASSWORD=your_password
   DATABASE_AUTOLOAD_ENTITIES=true
   DATABASE_SYNCHRONIZE=true

   # JWT
   JWT_SECRET=your_secure_jwt_secret
   JWT_TOKEN_AUDIENCE=http://localhost:3000
   JWT_TOKEN_ISSUER=http://localhost:3000
   JWT_TOKEN_EXPIRATION_TIME=3600
   JWT_REFRESH_TTL=86400

   # Application
   APP_PORT=3000
   NODE_ENV=development
   CORS_ORIGIN=https://your-frontend.com

   # Email (optional)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USERNAME=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   EMAIL_SECURE=false
   EMAIL_FROM=noreply@example.com
   ```

   > In production, set `DATABASE_SYNCHRONIZE=false` and use TypeORM migrations.

---

## Running the app

**Development**
```bash
npm run start:dev
```
API available at `http://localhost:3000`

**Production**
```bash
npm run build
npm run start:prod
```

**Debug**
```bash
npm run start:debug
```

---

## API documentation

With the app running, open:

**http://localhost:3000/docs**

Swagger provides interactive docs, request/response examples, and Bearer token authentication.

---

## Tests

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov

# End-to-end (requires PostgreSQL; uses database named `testing`)
npm run test:e2e
```

E2E tests use a separate database (`testing`) and `dropSchema: true` for isolation.

---

## Project structure

```
src/
├── app/                 # Root module and config
│   └── config/          # App config, pipes config
├── auth/                # Authentication and authorization
│   ├── guards/          # JWT and route-policy guards
│   ├── hashing/         # Password hashing (bcrypt)
│   ├── config/          # JWT config
│   └── decorators/      # Custom decorators
├── users/               # User CRUD and upload
├── messages/            # Messages and message_receivers
├── email/               # Email service (Nodemailer)
├── common/              # Shared utilities
│   ├── decorators/
│   ├── dto/             # e.g. pagination DTO
│   ├── filters/         # Exception filters
│   ├── guards/
│   ├── interceptors/
│   ├── pipes/
│   └── regex/
└── main.ts              # Bootstrap (Helmet, CORS, Swagger)
```

---

## Main endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth` | Login |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/users` | Create user |
| GET | `/users` | List users |
| GET | `/users/:id` | Get user (authenticated) |
| PATCH | `/users/:id` | Update own user |
| DELETE | `/users/:id` | Delete own user |
| POST | `/users/upload-picture` | Upload profile picture (authenticated) |
| GET | `/messages` | List messages (paginated) |
| GET | `/messages/:id` | Get message |
| POST | `/messages` | Create message (authenticated) |
| PATCH | `/messages/:id` | Update own message |
| DELETE | `/messages/:id` | Delete own message |

---

## Implemented practices

- Modular architecture (NestJS)
- Dependency injection
- DTOs and validation (class-validator)
- Global validation pipe (whitelist, transform)
- Custom exception filters and interceptors
- Auth and route-policy guards
- Custom pipes (e.g. ParseIntId)
- Rate limiting (Throttler)
- File upload and static file serving
- Environment-based config (Joi validation)
- OpenAPI documentation (Swagger)
- Unit and E2E tests
- TypeScript strict mode

---

## Security

- Passwords hashed with bcrypt
- JWT with expiration; refresh token flow
- Rate limiting to reduce abuse
- Helmet in production
- Strict input validation
- CORS configurable per environment
- Route protection via guards

---

## License

This project is private and has no public license.

---

## Author

**Gabriel Campos Peixoto**

If you find this useful, consider giving the repo a star.
