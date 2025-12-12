# MathWithMarcy

A full-stack gamified math learning platform. Practice math problems across
different topics and difficulty levels while tracking your progress with
detailed statistics.

![MathWithMarcy](./frontend/public/marcy.png)

## ✨ Features

- Interactive math practice with instant feedback
- Progress tracking with comprehensive statistics
- Secure JWT authentication with bcrypt password hashing
- GraphQL API with Swagger UI and GraphQL Playground
- Modern, responsive UI with Bootstrap 5

**Topics:** Geometry, Arithmetic, Algebra, Word Problems  
**Difficulty Levels:** Easy, Medium, Hard

## 🛠️ Tech Stack

**Frontend:** React 19.1.1, TypeScript 5.9.3, Vite, Apollo Client 4.0.9, Redux
Toolkit 2.11.0, React Router 7.9.4, Bootstrap 5.3.8

**Backend:** NestJS 10.4.20, GraphQL 16.12.0, Apollo Server 4.12.2, TypeORM
0.3.27, PostgreSQL, Passport JWT, bcrypt 5.1.1, class-validator 0.14.2

**Dev Tools:** ESLint, TypeScript ESLint, ts-node, Prettier

## 🚀 Getting Started

### Prerequisites

- Node.js v18.0.0+ ([Download](https://nodejs.org/))
- PostgreSQL v14.0+ ([Download](https://www.postgresql.org/download/))
- npm v9.0.0+ (included with Node.js)

### Installation

```bash
# Clone repository
git clone https://github.com/EliseTrad/MathWithMarcy.git
cd MathWithMarcy

# Install dependencies
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 🗄️ Database Setup

#### 1. Create PostgreSQL Database

Connect to PostgreSQL and create the database:

```sql
-- Using psql command line
psql -U postgres

-- Create database
CREATE DATABASE mathwithmarcy;

-- Verify creation
\l

-- Connect to database
\c mathwithmarcy

-- Exit psql
\q
```

**Using pgAdmin:**

1. Right-click on "Databases" → Create → Database
2. Name: `mathwithmarcy`
3. Owner: `postgres` (or your username)
4. Click "Save"

#### 2. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
cd backend
# On Windows (PowerShell)
New-Item -Path .env -ItemType File

# On macOS/Linux
touch .env
```

Add the following configuration to `backend/.env`:

````eDatabase Setup

1. **Create PostgreSQL Database**

```sql
psql -U postgres
CREATE DATABASE mathwithmarcy;
\q
````

2. **Configure Environment Variables**

Create `backend/.env` (use `backend/.env.example` as template):

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=mathwithmarcy
JWT_SECRET=your_64_character_secret_key
PORT=3000
```

**Generate secure JWT secret:**

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

3. **Initialize Schema**

TypeORM automatically creates tables on first start. Schema includes: `users`,
`questions`, `user_answers` with proper relationships and
indexes.\*Frontend:\*\* http://localhost:5173

- **Backend GraphQL Playground:** http://localhost:3001/graphql
- **Backend Swagger UI:** http://localhost:3001/api-docs
- **Backend API Endpoint:** http://localhost:3001/graphql

### 🏗️ Production Build

#### Build Backend

```bash
cd backend

# Compile TypeScript to JavaScript
npm run build

# Start production server
npm start
```

The compiled code will be in `backend/dist/`.

#### Build Frontend

```bash
cd frontend

# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

The production build will be in `frontend/dist/`.

**Deploy the production build:**

- **Frontend:** Deploy `frontend/dist/` to hosting (Vercel, Netlify, AWS S3,
  etc.)
- **Backend:** Deploy `backend/` to Node.js hosting (Heroku, Railway, AWS EC2,
  etc.)

### 🧪 Testing & Linting

#### Backend

```bash
cd backend

# Run ESLint
npm run lint

# Fix ESLint issues automatically
npm run lint -- --fix
```

#### Frontend

```bash
cd frontend

# Run ESLint
npm run lint

# Preview production build
npm run preview
```

### 📦 Project Scripts Reference

#### Root Package Scripts

```bash
npm install          # Install root dependencies
```

#### Backend Scripts

```bash
npm run start        # Start production server
npm run start:dev    # Start development server (watch mode)
npm run build        # Build TypeScript to JavaScript
npm run lint         # Run ESLint on source code
```

#### Frontend Scripts

```bash
npm run dev          # Start Vite dev server
npm run build        # Build production bundle
npm run preview      # Preview production build
npm run lint         # Run ESLint on source code
```

## 📁 Project Structure

```
MathWithMarcy/
├── backend/                      # NestJS GraphQL Backend
│   ├── src/
│   │   ├── auth/                 # Authentication (JWT, Passport, guards)
│   │   ├── users/                # User management (CRUD, profile)
│   │   ├── questions/            # Question management & answer validation
│   │   ├── user-answers/         # Answer tracking & statistics
│   │   ├── common/               # Shared utilities, filters, validators
│   │   ├── app.module.ts         # Root module
│   │   └── main.ts               # Bootstrap & configuration
│   ├── .env                      # Environment variables (not in git)
│   ├── .env.example              # Environment template
│   ├── package.json              # Dependencies & scripts
│   └── tsconfig.json             # TypeScript config
│
├── frontend/                     # React TypeScript Frontend
│   ├── src/
│   │   ├── components/           # Reusable components (Layout, forms, etc.)
│   │   ├── pages/                # Page components (Landing, Dashboard, etc.)
│   │   ├── store/                # Redux state management
│   │   ├── graphql/              # Apollo Client & operations
│   │   ├── types/                # TypeScript definitions
│   │   ├── App.tsx               # Root component with routing
│   │   └── main.tsx              # Entry point
│   ├── public/                   # Static assets
│   ├── package.json              # Dependencies & scripts
│   ├── tsconfig.json             # TypeScript config
│   └── vite.config.ts            # Vite configuration
│
├── .gitignore                    # Git ignore rules
├── package.json                  # Root package
└── README.md                     # Documentation
```

## 🗃️ Database Schema

### Entity-Relationship Diagram

```
┌─────────────────────────┐
│        users            │
├─────────────────────────┤
│ PK: user_id (SERIAL)    │◄─────┐
│ name (VARCHAR 100)      │      │
│ email (VARCHAR 150) UQ  │      │ 1
│ password (VARCHAR 255)  │      │
│ created_at (TIMESTAMP)  │      │
│ updated_at (TIMESTAMP)  │      │
└─────────────────────────┘      │
                                 │
                                 │
                                 │ Many
┌─────────────────────────┐      │
│      questions          │      │
├─────────────────────────┤      │
│ PK: question_id (SERIAL)│◄─┐   │
│ topic (VARCHAR 100)     │  │   │
│ difficulty (VARCHAR 50) │  │   │
│ question_text (TEXT)    │  │   │
│ correct_answer (VARCHAR)│  │   │
│ hint (TEXT, NULLABLE)   │  │   │
│ created_at (TIMESTAMP)  │  │ 1 │
│ updated_at (TIMESTAMP)  │  │   │
└─────────────────────────┘  │   │
                             │   │
                             │   │
                             │   │ Many
        ┌────────────────────┴───┴─────────────────┐
        │           user_answers                   │
        ├──────────────────────────────────────────┤
        │ PK: answer_id (SERIAL)                   │
        │ FK: user_id → users.user_id              │
        │ FK: question_id → questions.question_id  │
        │ user_answer (VARCHAR 255)                │
        │ is_correct (BOOLEAN)                     │
        │ created_at (TIMESTAMP)                   │
        │ updated_at (TIMESTAMP)                   │
        └──────────────────────────────────────────┘
```

## 🎮 Usage

1. **Register/Login** at http://localhost:5173
2. **Dashboard** - View your statistics and progress
3. **Questions** - Filter by topic/difficulty and answer questions
4. **Profile** - Update account settings

**Password Requirements:** 8+ chars, uppercase, lowercase, number, special
character

## 🔌 GraphQL API

**Endpoint:** `http://localhost:3001/graphql`  
**Playground:** `http://localhost:3001/graphql` (interactive testing)  
**Swagger UI:** `http://localhost:3001/api-docs` (documentation)

### Key Operations

**Authentication (Public):**

- `register` - Create new account
- `login` - Get JWT token

**User (Protected):**

- `me` - Get current user
- `updateUser` - Update profile
- `changePassword` - Change password
- `deleteUser` - Delete account

**Questions (Protected):**

- `questions` - List/filter questions
- `question(id)` - Get single question
- `submitAnswer` - Submit answer and get result
- `createQuestion` - Add new question
- `updateQuestion` - Update question
- `deleteQuestion` - Remove question

**Statistics (Protected):**

- `myStatistics` - Get user stats by topic/difficulty

### Authentication

Add JWT token to requests:

```
Authorization: Bearer YOUR_TOKEN
```

Token expires after 1 day (30 days with "remember me"). Use GraphQL Playground
for interactive testing with schema documentation.

## 🔒 Security

**Authentication:**

- JWT tokens with bcrypt password hashing (10 rounds)
- Passport JWT strategy with guards on protected routes
- Token expiration: 1 day (30 days with "remember me")

**Validation:**

- class-validator decorators on all DTOs
- Strong password requirements (8+ chars, mixed case, numbers, special chars)
- Input sanitization and whitelisting
- TypeORM parameterized queries prevent SQL injection

**Best Practices:**

- CORS configuration for specific origins
- Global validation pipe with whitelist
- Exception filters for consistent error handling
- No sensitive data in error messages
- Environment variables for secrets

**Protected Against:** SQL injection, XSS, CSRF, mass assignment, brute force,
password attacks

## 🐛 Troubleshooting

**Database Connection Issues:**

- Verify PostgreSQL is running
- Check credentials in `backend/.env`
- Ensure database exists: `CREATE DATABASE mathwithmarcy;`

**JWT/Auth Errors:**

- Get fresh token via login if expired
- Check Authorization header format: `Bearer TOKEN`

**Port Already in Use:**

```powershell
# Windows
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process
```

**Build Issues:**

```bash
# Clean install
rm -rf node_modules package-lock.json dist
npm install
```

**Need Help?**

- Check backend logs and browser console (F12)
- Test queries in GraphQL Playground: http://localhost:3001/graphql
- Inspect database: `psql -U postgres -d mathwithmarcy`

## 🤝 Contributing

Contributions welcome! Follow these steps:

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

**Guidelines:**

- Follow existing code style (ESLint)
- Add JSDoc comments for new methods
- Update documentation for API changes

## 📄 License

MIT License - See LICENSE file for details.

## 👨‍💻 Author

Created by [EliseTrad](https://github.com/EliseTrad)

## 📞 Support

**GitHub Issues:**
[https://github.com/EliseTrad/MathWithMarcy/issues](https://github.com/EliseTrad/MathWithMarcy/issues)

---

**Happy Learning!** 🎓✨
