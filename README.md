# MathWithMarcy

A full-stack gamified math learning platform featuring Marcy from Adventure
Time! Practice math problems across different topics and difficulty levels while
tracking your progress with detailed statistics.

![MathWithMarcy](./frontend/public/marcy.png)

## ✨ Features

- **Interactive Math Practice** - Solve problems across multiple topics with
  instant feedback
- **Progress Tracking** - Comprehensive statistics grouped by topic and
  difficulty
- **Beautiful UI** - Modern, responsive design with Bootstrap 5 and custom
  theming
- **Secure Authentication** - JWT-based authentication with bcrypt password
  hashing
- **Personalized Dashboard** - View performance metrics and statistics
- **Real-time Feedback** - Instant answer validation with helpful hints
- **GraphQL API** - Type-safe, efficient API with self-documenting schema

## 📚 Topics & Difficulty Levels

**Topics:**

- Geometry
- Arithmetic
- Algebra
- Word Problems

**Difficulty Levels:** Easy, Medium, Hard

## 🛠️ Tech Stack

### Frontend

- **React 19.1.1** - Latest React with modern hooks
- **TypeScript 5.9.3** - Type-safe development
- **Vite** - Fast build tool (using rolldown-vite@7.1.14)
- **React Router 7.9.4** - Client-side routing
- **Apollo Client 4.0.9** - GraphQL client with caching
- **Redux Toolkit 2.11.0** - State management
- **React Redux 9.2.0** - React bindings for Redux
- **Bootstrap 5.3.8** - UI component framework

### Backend

- **NestJS 10.4.20** - Progressive Node.js framework
- **GraphQL 16.12.0** - Query language for APIs
- **Apollo Server 4.12.2** - GraphQL server
- **TypeORM 0.3.27** - ORM for TypeScript and JavaScript
- **PostgreSQL 8.16.3** - Relational database (pg driver)
- **JWT** - JSON Web Tokens for authentication
- **Passport 0.6.0** - Authentication middleware
- **Passport JWT 4.0.1** - JWT strategy for Passport
- **bcrypt 5.1.1** - Password hashing
- **class-validator 0.14.2** - Decorator-based validation
- **class-transformer 0.5.1** - Object transformation

### Development Tools

- **ESLint 9.38.0** - Code linting
- **TypeScript ESLint 8.45.0** - TypeScript-specific linting
- **ts-node 10.9.2** - TypeScript execution for Node.js

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18.0.0 or higher ([Download](https://nodejs.org/))
- **PostgreSQL** v14.0 or higher
  ([Download](https://www.postgresql.org/download/))
- **npm** v9.0.0 or higher (comes with Node.js)
- **Git** ([Download](https://git-scm.com/downloads))

**Recommended:**

- **pgAdmin** or **DBeaver** for database management
- **Postman** or **Insomnia** for API testing (though GraphQL Playground is
  built-in)
- **VS Code** with extensions: ESLint, Prettier, GraphQL

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/EliseTrad/MathWithMarcy.git
cd MathWithMarcy
```

#### 2. Install Root Dependencies

```bash
npm install
```

This installs shared dependencies used across the project.

#### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

**Backend dependencies installed:**

- NestJS framework and modules
- GraphQL and Apollo Server
- TypeORM and PostgreSQL driver
- Authentication (Passport, JWT, bcrypt)
- Validation (class-validator, class-transformer)

#### 4. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

**Frontend dependencies installed:**

- React and React DOM
- Apollo Client for GraphQL
- Redux Toolkit for state management
- React Router for navigation
- Vite for development and building

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

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=mathwithmarcy

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long

# Server Configuration
PORT=3001
NODE_ENV=development
```

**Important Security Notes:**

- Replace `your_postgres_password` with your actual PostgreSQL password
- Generate a strong `JWT_SECRET` (minimum 32 characters)
- **NEVER commit the `.env` file to version control** (already in `.gitignore`)

**Generate a secure JWT secret:**

```bash
# On Node.js (cross-platform)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# On Linux/macOS
openssl rand -hex 64

# On Windows PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})
```

#### 3. Initialize Database Schema

The database schema is automatically created when you first start the backend
server. TypeORM will:

- Create all tables (users, questions, user_answers)
- Set up foreign key relationships
- Create indexes for optimized queries
- Apply constraints (unique emails, NOT NULL fields)

**Manual Migration (Optional):** If you prefer manual control, you can generate
and run migrations:

```bash
cd backend

# Generate migration based on entities
npm run migration:generate -- -n InitialSchema

# Run migrations
npm run migration:run

# Revert last migration (if needed)
npm run migration:revert
```

#### 4. Seed Sample Questions (Optional)

To populate the database with sample questions for testing:

```sql
-- Connect to database
psql -U postgres -d mathwithmarcy

-- Insert sample questions
INSERT INTO questions (topic, difficulty, question_text, correct_answer, hint) VALUES
  ('Algebra', 'Easy', 'Solve for x: 2x + 5 = 15', '5', 'Subtract 5 from both sides first'),
  ('Geometry', 'Medium', 'What is the area of a circle with radius 7?', '153.94', 'Use formula: πr²'),
  ('Arithmetic', 'Easy', 'What is 25 + 37?', '62', 'Add the ones place, then the tens place'),
  ('WordProblem', 'Hard', 'If a train travels 120 km in 2 hours, what is its speed?', '60', 'Speed = Distance ÷ Time');
```

### ▶️ Running the Application

#### Development Mode

**Start Backend Server:**

```bash
cd backend
npm run start:dev
```

Expected output:

```
[Nest] INFO [NestFactory] Starting Nest application...
[Nest] INFO [TypeOrmModule] TypeORM connected to database
[Nest] INFO [GraphQLModule] Mapped {/graphql, POST} route
[Nest] INFO [NestApplication] Nest application successfully started
Server running on http://localhost:3001
GraphQL Playground: http://localhost:3001/graphql
```

**Start Frontend Development Server:**

Open a new terminal:

```bash
cd frontend
npm run dev
```

Expected output:

```
VITE v7.1.14  ready in 450 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

#### Access the Application

- **Frontend:** http://localhost:5173
- **Backend GraphQL Playground:** http://localhost:3001/graphql
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
│   │   ├── auth/                 # Authentication Module
│   │   │   ├── auth.service.ts   # Auth business logic (register, login, JWT)
│   │   │   ├── auth.resolver.ts  # GraphQL resolvers for auth
│   │   │   ├── auth.module.ts    # Auth module configuration
│   │   │   ├── jwt.strategy.ts   # Passport JWT strategy
│   │   │   ├── gql-auth.guard.ts # GraphQL authentication guard
│   │   │   ├── current-user.decorator.ts # Extract user from request
│   │   │   ├── auth.inputs.ts    # GraphQL input types
│   │   │   ├── auth.types.ts     # GraphQL object types
│   │   │   └── dto/              # Data Transfer Objects
│   │   │       ├── login.dto.ts
│   │   │       └── register.dto.ts
│   │   │
│   │   ├── users/                # User Management Module
│   │   │   ├── users.service.ts  # User CRUD operations
│   │   │   ├── users.resolver.ts # GraphQL resolvers for users
│   │   │   ├── users.module.ts   # Users module configuration
│   │   │   ├── user.entity.ts    # TypeORM User entity
│   │   │   ├── users.inputs.ts   # GraphQL input types
│   │   │   ├── users.types.ts    # GraphQL object types
│   │   │   └── dto/
│   │   │       ├── create-user.dto.ts
│   │   │       ├── update-user.dto.ts
│   │   │       └── change-password.dto.ts
│   │   │
│   │   ├── questions/            # Question Management Module
│   │   │   ├── questions.service.ts # Question CRUD, answer validation
│   │   │   ├── questions.resolver.ts # GraphQL resolvers for questions
│   │   │   ├── questions.module.ts  # Questions module configuration
│   │   │   ├── question.entity.ts   # TypeORM Question entity
│   │   │   ├── questions.inputs.ts  # GraphQL input types
│   │   │   ├── questions.types.ts   # GraphQL object types
│   │   │   └── dto/
│   │   │       ├── create-question.dto.ts
│   │   │       ├── update-question.dto.ts
│   │   │       ├── submit-answer.dto.ts
│   │   │       └── get-questions-filter.dto.ts
│   │   │
│   │   ├── user-answers/         # Answer Tracking & Statistics Module
│   │   │   ├── user-answers.service.ts # Statistics calculation
│   │   │   ├── user-answers.resolver.ts # GraphQL resolvers
│   │   │   ├── user-answers.module.ts   # Module configuration
│   │   │   ├── user-answer.entity.ts    # TypeORM UserAnswer entity
│   │   │   ├── user-answers.types.ts    # GraphQL object types
│   │   │   └── dto/
│   │   │       ├── create-user-answer.dto.ts
│   │   │       ├── update-user-answer.dto.ts
│   │   │       ├── get-user-answers-filter.dto.ts
│   │   │       └── user-statistics.dto.ts
│   │   │
│   │   ├── common/               # Shared Utilities
│   │   │   ├── common.module.ts  # Common module
│   │   │   ├── filters/          # Exception filters
│   │   │   │   ├── http-exception.filter.ts      # HTTP error handler
│   │   │   │   └── database-exception.filter.ts  # DB error handler
│   │   │   └── validators/       # Custom validators
│   │   │       └── custom.validators.ts # Strong password, valid name, etc.
│   │   │
│   │   ├── app.module.ts         # Root application module
│   │   └── main.ts               # Application entry point
│   │
│   ├── .env                      # Environment variables (NOT in git)
│   ├── package.json              # Backend dependencies and scripts
│   ├── tsconfig.json             # TypeScript configuration
│   └── nest-cli.json             # NestJS CLI configuration
│
├── frontend/                     # React TypeScript Frontend
│   ├── public/
│   │   ├── marcy.png             # Marcy mascot image
│   │   └── bg.png                # Background image
│   │
│   ├── src/
│   │   ├── components/           # Reusable React Components
│   │   │   ├── Layout.tsx        # Main layout wrapper
│   │   │   ├── ProtectedLayout.tsx # Auth-protected layout
│   │   │   ├── Header.tsx        # App header with navigation
│   │   │   ├── Footer.tsx        # App footer
│   │   │   ├── PublicNavbar.tsx  # Navigation for logged-out users
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.tsx    # Login form component
│   │   │   │   └── RegisterForm.tsx # Registration form
│   │   │   └── questions/
│   │   │       ├── QuestionCard.tsx    # Individual question display
│   │   │       ├── TopicSelector.tsx   # Topic/difficulty filters
│   │   │       └── FeedbackMessage.tsx # Answer feedback display
│   │   │
│   │   ├── pages/                # Page Components
│   │   │   ├── Landing.tsx       # Public landing page
│   │   │   ├── Login.tsx         # Login page
│   │   │   ├── Register.tsx      # Registration page
│   │   │   ├── Dashboard.tsx     # User dashboard with statistics
│   │   │   ├── Questions.tsx     # Question practice page
│   │   │   └── Profile.tsx       # User profile management
│   │   │
│   │   ├── store/                # Redux State Management
│   │   │   ├── index.ts          # Redux store configuration
│   │   │   └── slices/
│   │   │       ├── authSlice.ts        # Authentication state
│   │   │       ├── questionsSlice.ts   # Questions state
│   │   │       ├── statisticsSlice.ts  # User statistics state
│   │   │       ├── uiSlice.ts          # UI state (loading, errors)
│   │   │       └── formSlice.ts        # Form state
│   │   │
│   │   ├── graphql/              # GraphQL Configuration
│   │   │   ├── client.ts         # Apollo Client setup
│   │   │   └── operations.ts     # GraphQL queries & mutations
│   │   │
│   │   ├── types/                # TypeScript Type Definitions
│   │   │   ├── questions.ts      # Question-related types
│   │   │   └── statistics.ts     # Statistics types
│   │   │
│   │   ├── App.tsx               # Root application component
│   │   ├── App.css               # Application styles
│   │   ├── main.tsx              # Application entry point
│   │   └── index.css             # Global styles
│   │
│   ├── package.json              # Frontend dependencies and scripts
│   ├── tsconfig.json             # TypeScript configuration
│   ├── tsconfig.app.json         # App-specific TypeScript config
│   ├── tsconfig.node.json        # Node-specific TypeScript config
│   ├── vite.config.ts            # Vite build configuration
│   ├── eslint.config.js          # ESLint configuration
│   └── index.html                # HTML entry point
│
├── .gitignore                    # Git ignore rules
├── package.json                  # Root package.json
├── README.md                     # This file - Project documentation
├── GRAPHQL_API_REFERENCE.md      # Complete GraphQL API documentation
└── BACKEND_API_DOCUMENTATION.md  # Backend technical documentation
```

### Key Files Explained

#### Backend

- **`main.ts`** - Bootstraps NestJS app, configures CORS, validation, and
  exception filters
- **`app.module.ts`** - Root module that imports all feature modules and
  configures TypeORM/GraphQL
- **`*.entity.ts`** - TypeORM entities defining database schema with decorators
- **`*.service.ts`** - Business logic layer with database operations
- **`*.resolver.ts`** - GraphQL resolvers handling queries and mutations
- **`*.dto.ts`** - Data Transfer Objects with class-validator decorators
- **`.env`** - Environment variables (database credentials, JWT secret) - **NOT
  committed**

#### Frontend

- **`main.tsx`** - React entry point, renders App component with providers
  (Redux, Apollo, Router)
- **`App.tsx`** - Main app component with route definitions
- **`store/index.ts`** - Configures Redux store with all slices
- **`graphql/client.ts`** - Configures Apollo Client with authentication
  middleware
- **`graphql/operations.ts`** - All GraphQL queries and mutations used by the
  app

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

### Table Details

#### `users` Table

Stores student accounts and authentication credentials.

| Column     | Type             | Constraints             | Description                        |
| ---------- | ---------------- | ----------------------- | ---------------------------------- |
| user_id    | SERIAL (INTEGER) | PRIMARY KEY             | Auto-incrementing user identifier  |
| name       | VARCHAR(100)     | NOT NULL                | Student's full name                |
| email      | VARCHAR(150)     | NOT NULL, UNIQUE        | Login email (case-insensitive)     |
| password   | VARCHAR(255)     | NOT NULL                | bcrypt hashed password (10 rounds) |
| created_at | TIMESTAMP        | NOT NULL, DEFAULT NOW() | Account creation timestamp         |
| updated_at | TIMESTAMP        | NOT NULL, DEFAULT NOW() | Last update timestamp              |

**Indexes:**

- `uq_users_email` (UNIQUE) - Enforces email uniqueness
- `idx_users_created_at` - Optimizes reporting queries

**Relationships:**

- One-to-Many with `user_answers` (cascade delete)

---

#### `questions` Table

Stores math problems with topics, difficulty levels, and answers.

| Column         | Type             | Constraints             | Description                           |
| -------------- | ---------------- | ----------------------- | ------------------------------------- |
| question_id    | SERIAL (INTEGER) | PRIMARY KEY             | Auto-incrementing question identifier |
| topic          | VARCHAR(100)     | NOT NULL                | Question category (Algebra, etc.)     |
| difficulty     | VARCHAR(50)      | NOT NULL                | Difficulty level (Easy/Medium/Hard)   |
| question_text  | TEXT             | NOT NULL                | Full question prompt                  |
| correct_answer | VARCHAR(255)     | NOT NULL                | Canonical correct answer              |
| hint           | TEXT             | NULLABLE                | Optional hint for students            |
| created_at     | TIMESTAMP        | NOT NULL, DEFAULT NOW() | Question creation timestamp           |
| updated_at     | TIMESTAMP        | NOT NULL, DEFAULT NOW() | Last update timestamp                 |

**Indexes:**

- `idx_questions_topic` - Optimizes topic filtering
- `idx_questions_difficulty` - Optimizes difficulty filtering
- `idx_questions_topic_difficulty` (COMPOSITE) - Optimizes combined filtering

**Relationships:**

- One-to-Many with `user_answers` (cascade delete)

**Valid Values:**

- **topic**: `Geometry`, `Algebra`, `Arithmetic`, `WordProblem`
- **difficulty**: `Easy`, `Medium`, `Hard`

---

#### `user_answers` Table

Tracks all student answer submissions with correctness evaluation.

| Column      | Type             | Constraints                  | Description                         |
| ----------- | ---------------- | ---------------------------- | ----------------------------------- |
| answer_id   | SERIAL (INTEGER) | PRIMARY KEY                  | Auto-incrementing answer identifier |
| user_id     | INTEGER          | NOT NULL, FK → users.user_id | Student who submitted answer        |
| question_id | INTEGER          | NOT NULL, FK → questions.id  | Question being answered             |
| user_answer | VARCHAR(255)     | NOT NULL                     | Student's submitted answer          |
| is_correct  | BOOLEAN          | NOT NULL, DEFAULT false      | Whether answer matches correct one  |
| created_at  | TIMESTAMP        | NOT NULL, DEFAULT NOW()      | Answer submission timestamp         |
| updated_at  | TIMESTAMP        | NOT NULL, DEFAULT NOW()      | Last update timestamp               |

**Indexes:**

- `idx_user_answers_user_id` - Optimizes user-specific queries
- `idx_user_answers_question_id` - Optimizes question-specific queries
- `idx_user_answers_is_correct` - Optimizes statistics queries
- `idx_user_answers_user_created` (COMPOSITE: user_id, created_at) - Optimizes
  chronological queries

**Foreign Keys:**

- `user_id` → `users.user_id` (CASCADE DELETE)
- `question_id` → `questions.question_id` (CASCADE DELETE)

**Relationships:**

- Many-to-One with `users`
- Many-to-One with `questions`

---

### Database Constraints & Rules

#### Cascade Deletion

- Deleting a user automatically deletes all their answers
- Deleting a question automatically deletes all associated answers

#### Data Integrity

- Email uniqueness prevents duplicate accounts
- NOT NULL constraints ensure complete records
- Foreign keys maintain referential integrity
- Boolean default ensures `is_correct` always has a value

#### Performance Optimizations

- Composite index on (topic, difficulty) for common filter queries
- Composite index on (user_id, created_at) for performance tracking
- Individual indexes on frequently queried columns

---

### TypeORM Configuration

The schema is automatically synchronized from TypeORM entities located in:

- `backend/src/users/user.entity.ts`
- `backend/src/questions/question.entity.ts`
- `backend/src/user-answers/user-answer.entity.ts`

**Auto-synchronization** is enabled in development mode via `synchronize: true`
in `app.module.ts`.

**For production**, disable auto-sync and use migrations:

```typescript
// app.module.ts
TypeOrmModule.forRoot({
  synchronize: false, // Disable auto-sync in production
  migrations: ['dist/migrations/*.js'],
  migrationsRun: true,
});
```

## 🎮 How to Use the Application

### Quick Start Guide

1. **Register an Account**

   - Navigate to http://localhost:5173
   - Click "Register" in the navigation
   - Fill in your name, email, and create a strong password
   - Password must have: 8+ characters, uppercase, lowercase, number, special
     character

2. **Login**

   - Enter your email and password
   - Optionally check "Remember me" for extended session (30 days)
   - Upon successful login, you'll see your personalized dashboard

3. **View Your Dashboard**

   - See your overall accuracy percentage
   - View statistics broken down by topic and difficulty
   - Track total questions answered and correct answers

4. **Practice Questions**

   - Click "Questions" in the navigation
   - Filter by topic: Geometry, Algebra, Arithmetic, Word Problems
   - Filter by difficulty: Easy, Medium, Hard
   - Optionally enable "Random Order" for variety

5. **Answer Questions**

   - Read the question carefully
   - Enter your answer in the input field
   - Click "Submit Answer"
   - Get instant feedback (correct/incorrect)
   - See the correct answer if you were wrong
   - View hint if you need help

6. **Track Your Progress**

   - Return to Dashboard to see updated statistics
   - Statistics update in real-time after each answer
   - View breakdown by topic and difficulty level

7. **Manage Your Profile**

   - Click "Profile" to update your name or email
   - Change your password securely
   - Delete your account if needed (irreversible)

8. **Logout**
   - Click "Logout" in the navigation
   - Your session is cleared securely

### User Workflows

#### Student Practice Session

```
Register/Login → Dashboard (view stats) → Questions → Filter topic/difficulty
→ Answer questions → View feedback → Return to Dashboard → Track improvement
```

#### Admin Question Management (via GraphQL Playground)

```
Login → Get JWT token → GraphQL Playground → createQuestion mutation
→ updateQuestion mutation → deleteQuestion mutation
```

## 🔌 GraphQL API

This application uses **GraphQL** for all client-server communication, providing
type-safe, efficient data fetching with a self-documenting API.

### GraphQL Endpoint

**Development:**

```
http://localhost:3001/graphql
```

**Production:**

```
https://your-domain.com/graphql
```

### Interactive API Exploration

**GraphQL Playground** is available at http://localhost:3001/graphql for
interactive testing:

- **Browse Schema** - Complete API documentation with types
- **Test Queries** - Run queries and mutations interactively
- **Auto-completion** - IntelliSense for GraphQL operations
- **Documentation** - Built-in docs for all operations

**Example Query in Playground:**

```graphql
query GetMyProfile {
  me {
    user_id
    name
    email
    created_at
  }
}
```

### Available Operations

#### Authentication (Public)

**`register` Mutation**

```graphql
mutation Register {
  register(
    input: {
      name: "John Doe"
      email: "john@example.com"
      password: "SecureP@ss123"
    }
  ) {
    user_id
    name
    email
  }
}
```

**`login` Mutation**

```graphql
mutation Login {
  login(
    input: {
      email: "john@example.com"
      password: "SecureP@ss123"
      remember: true
    }
  ) {
    accessToken
    user {
      user_id
      name
      email
    }
  }
}
```

#### User Profile (Protected)

**`me` Query** - Get current user profile

```graphql
query MyProfile {
  me {
    user_id
    name
    email
    created_at
  }
}
```

**`updateUser` Mutation** - Update profile information

```graphql
mutation UpdateProfile {
  updateUser(input: { name: "Jane Doe", email: "jane@example.com" }) {
    user_id
    name
    email
  }
}
```

**`changePassword` Mutation** - Change password

```graphql
mutation ChangePassword {
  changePassword(
    input: { currentPassword: "OldP@ss123", newPassword: "NewP@ss456" }
  )
}
```

**`deleteUser` Mutation** - Delete account

```graphql
mutation DeleteAccount {
  deleteUser
}
```

#### Questions (Protected)

**`questions` Query** - Get filtered questions

```graphql
query GetQuestions {
  questions(input: { topic: "Algebra", difficulty: "Medium", random: "true" }) {
    question_id
    topic
    difficulty
    question_text
    hint
  }
}
```

**`question` Query** - Get single question

```graphql
query GetQuestion {
  question(id: 1) {
    question_id
    topic
    difficulty
    question_text
    correct_answer
    hint
  }
}
```

**`submitAnswer` Mutation** - Submit answer to question

```graphql
mutation SubmitAnswer {
  submitAnswer(questionId: 1, userAnswer: "42") {
    isCorrect
    correctAnswer
    userAnswerId
  }
}
```

**`createQuestion` Mutation** - Create new question

```graphql
mutation CreateQuestion {
  createQuestion(
    input: {
      topic: "Algebra"
      difficulty: "Easy"
      question_text: "Solve for x: 2x + 5 = 15"
      correct_answer: "5"
      hint: "Subtract 5 from both sides first"
    }
  ) {
    question_id
    topic
    difficulty
  }
}
```

**`updateQuestion` Mutation** - Update existing question

```graphql
mutation UpdateQuestion {
  updateQuestion(id: 1, input: { hint: "Remember to isolate the variable" }) {
    question_id
    hint
  }
}
```

**`deleteQuestion` Mutation** - Delete question

```graphql
mutation DeleteQuestion {
  deleteQuestion(id: 1)
}
```

#### Statistics (Protected)

**`myStatistics` Query** - Get comprehensive user statistics

```graphql
query MyStats {
  myStatistics {
    totalAnswered
    correctAnswers
    accuracy
    topics {
      geometry {
        answered
        correct
        byDifficulty {
          easy {
            answered
            correct
          }
        }
      }
      algebra {
        answered
        correct
        byDifficulty {
          medium {
            answered
            correct
          }
        }
      }
      arithmetic {
        answered
        correct
        byDifficulty {
          hard {
            answered
            correct
          }
        }
      }
      wordProblem {
        answered
        correct
      }
    }
    difficulties {
      easy {
        answered
        correct
      }
      medium {
        answered
        correct
      }
      hard {
        answered
        correct
      }
    }
  }
}
```

### Authentication

All protected operations require a JWT token in the Authorization header:

**Header Format:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**How to Authenticate:**

1. **Get Token via Login:**

   ```graphql
   mutation {
     login(input: { email: "user@example.com", password: "pass" }) {
       accessToken
       user {
         user_id
         name
       }
     }
   }
   ```

2. **Add Token to Requests:**

   - In GraphQL Playground: Add to HTTP Headers
     ```json
     {
       "Authorization": "Bearer YOUR_TOKEN_HERE"
     }
     ```
   - In Apollo Client: Automatically handled by `setContext` middleware
   - In curl/Postman: Add Authorization header manually

3. **Token Expiration:**
   - Default: 1 day (86400 seconds)
   - With "Remember Me": 30 days (2592000 seconds)
   - Refresh by logging in again

### Complete API Documentation

📘 **[GRAPHQL_API_REFERENCE.md](./GRAPHQL_API_REFERENCE.md)** - Comprehensive
GraphQL API documentation:

- All queries and mutations with detailed examples
- Complete request/response formats
- Input validation rules and constraints
- Authentication requirements per operation
- Error codes and handling
- Type definitions and schemas
- Best practices and usage patterns

📘 **[BACKEND_API_DOCUMENTATION.md](./BACKEND_API_DOCUMENTATION.md)** - Backend
technical documentation:

- Complete method documentation for all services
- Business logic explanations
- Database operations and patterns
- Security considerations
- Error handling strategies

### GraphQL vs REST

This application uses **GraphQL exclusively** (not REST/Swagger):

**Why GraphQL?**

- ✅ Type-safe API with schema validation
- ✅ Self-documenting via introspection
- ✅ Fetch exactly what you need (no over/under-fetching)
- ✅ Single endpoint for all operations
- ✅ Built-in GraphQL Playground for testing
- ✅ Strong TypeScript integration

**Note:** There is no Swagger/OpenAPI documentation as GraphQL provides
introspection and self-documentation through the GraphQL schema and Playground.

## 🔒 Security & Validation

MathWithMarcy implements comprehensive security measures and input validation to
protect against common web vulnerabilities and ensure data integrity.

### Input Validation

All incoming data is validated using **class-validator** decorators on DTOs
before reaching business logic.

#### Authentication DTOs

**LoginDto** (`backend/src/auth/dto/login.dto.ts`)

- Email: Must be valid format, max 150 characters
- Password: Required, max 255 characters
- Remember: Optional boolean

**RegisterDto** (`backend/src/auth/dto/register.dto.ts`)

- Name: 2-100 characters, letters/spaces/hyphens/apostrophes only
  (`@IsValidName`)
- Email: Valid format, max 150 characters, unique constraint
- Password: Strong password required (`@IsStrongPassword`)
  - Minimum 8 characters, maximum 255
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character

**ChangePasswordDto** (`backend/src/users/dto/change-password.dto.ts`)

- Current password: Required
- New password: Must meet strong password requirements
- Validation: New password cannot match current password

#### Question DTOs

**CreateQuestionDto** (`backend/src/questions/dto/create-question.dto.ts`)

- Topic: Whitelist validation (`@IsValidTopic`: Geometry, Algebra, Arithmetic,
  WordProblem)
- Difficulty: Whitelist validation (`@IsValidDifficulty`: Easy, Medium, Hard)
- Question text: Required, minimum 5 characters
- Correct answer: Required, minimum 1 character
- Hint: Optional, maximum 500 characters

**SubmitAnswerDto** (`backend/src/questions/dto/submit-answer.dto.ts`)

- User answer: Required, trimmed, maximum 255 characters
- Sanitization: Automatic trim and normalization

**GetQuestionsFilterDto**
(`backend/src/questions/dto/get-questions-filter.dto.ts`)

- Topic: Optional, enum validation
- Difficulty: Optional, enum validation
- Random: Optional, string boolean ('true'/'false')

#### Custom Validators

Located in `backend/src/common/validators/custom.validators.ts`:

**`@IsStrongPassword()`**

- Validates password complexity
- Minimum 8 characters
- Mixed case requirement (upper + lower)
- Number requirement
- Special character requirement
- Clear error messages for each failed condition

**`@IsValidName()`**

- Allows: letters, spaces, hyphens, apostrophes
- Rejects: numbers, special characters (except - and ')
- Prevents code injection via names

**`@IsValidTopic()`**

- Whitelist: Geometry, Algebra, Arithmetic, WordProblem
- Case-sensitive validation
- Prevents invalid topic injection

**`@IsValidDifficulty()`**

- Whitelist: Easy, Medium, Hard
- Case-sensitive validation
- Prevents invalid difficulty injection

### Security Features

#### Authentication & Authorization

**JWT Tokens** (`backend/src/auth/jwt.strategy.ts`)

- Stateless authentication with signed tokens
- Configurable expiration (1 day default, 30 days with remember)
- Secure secret from environment variables
- Token validation on every protected request

**Passport JWT Strategy** (`backend/src/auth/jwt.strategy.ts`)

- Extracts JWT from Authorization header (Bearer scheme)
- Validates token signature and expiration
- Populates user context from token payload
- Detailed error handling for invalid/expired tokens

**GqlAuthGuard** (`backend/src/auth/gql-auth.guard.ts`)

- GraphQL-specific authentication guard
- Extends Passport's AuthGuard for GraphQL context
- Automatically protects resolvers with `@UseGuards(GqlAuthGuard)`
- Returns 401 Unauthorized for missing/invalid tokens

**@CurrentUser Decorator** (`backend/src/auth/current-user.decorator.ts`)

- Securely extracts authenticated user from request context
- Type-safe user object injection
- Used in all protected resolvers

**Password Hashing** (`backend/src/users/users.service.ts`)

- bcrypt algorithm with 10 salt rounds
- Automatic hashing on registration and password change
- Secure comparison using bcrypt.compare()
- Never stores plain-text passwords

#### Protected Operations

All operations requiring authentication (annotated with
`@UseGuards(GqlAuthGuard)`):

**User Operations:**

- View profile (`me` query)
- Update profile (`updateUser` mutation)
- Change password (`changePassword` mutation)
- Delete account (`deleteUser` mutation)

**Question Operations:**

- Fetch questions (`questions`, `question` queries)
- Submit answers (`submitAnswer` mutation)
- Create questions (`createQuestion` mutation)
- Update questions (`updateQuestion` mutation)
- Delete questions (`deleteQuestion` mutation)

**Statistics Operations:**

- View statistics (`myStatistics` query)

#### Database Security

**TypeORM Parameterized Queries**

- All queries use parameterized statements
- Prevents SQL injection attacks
- Automatic escaping of user input

**Entity Validation**

- Type checking at ORM level
- Column constraints enforced in database
- Foreign key integrity maintained

**Unique Constraints**

- Email uniqueness prevents duplicate accounts
- Database-level enforcement

**Foreign Key Constraints**

- Referential integrity between tables
- CASCADE DELETE for related records
- Prevents orphaned data

#### Error Handling

**Global Exception Filters** (`backend/src/common/filters/`)

**HttpExceptionFilter** (`http-exception.filter.ts`)

- Catches all HTTP exceptions
- Formats consistent error responses
- Logs errors with severity levels
- Includes request context (path, method, timestamp)
- Never exposes internal server details to clients

**DatabaseExceptionFilter** (`database-exception.filter.ts`)

- Transforms database errors into user-friendly messages
- Handles TypeORM-specific errors:
  - Unique constraint violations → `409 CONFLICT` ("Email already registered")
  - Foreign key violations → `400 BAD_REQUEST`
  - Not null violations → `400 BAD_REQUEST`
  - Entity not found → `404 NOT_FOUND`
- Prevents database schema leakage
- Logs full error details server-side only

**Validation Error Messages**

- Clear, actionable feedback
- No technical jargon exposed
- Field-specific error messages
- Array of all validation errors returned

#### Configuration Security

**Environment Variables** (`backend/.env`)

- All sensitive data in environment variables
- Never committed to version control (in `.gitignore`)
- Joi validation ensures required variables present at startup
- Type-safe configuration module

**CORS Configuration** (`backend/src/main.ts`)

- Restricted to specific frontend origin
- Credentials support enabled for cookies/auth headers
- Configurable per environment (dev vs production)

**Validation Pipe** (`backend/src/main.ts`)

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true, // Strip unknown properties
    forbidNonWhitelisted: true, // Throw error on unknown props
    transform: true, // Auto-transform to DTO types
    transformOptions: {
      enableImplicitConversion: true,
    },
  })
);
```

#### Best Practices Implemented

- ✅ Input sanitization (trim, lowercase for emails)
- ✅ Output encoding (handled by GraphQL type system)
- ✅ Strong password requirements with custom validator
- ✅ JWT token expiration (configurable)
- ✅ No sensitive data in error messages (generic messages prevent user
  enumeration)
- ✅ Separation of DTOs from entities (passwords never exposed in responses)
- ✅ Rate limiting ready (can add with `@nestjs/throttler`)
- ✅ HTTPS ready (configure reverse proxy in production)
- ✅ Security headers (add Helmet.js for production)
- ✅ CSRF protection (JWT in headers, not cookies)
- ✅ XSS protection (React auto-escaping, GraphQL validation)

### Protection Against Common Vulnerabilities

| Vulnerability                     | Protection Mechanism                               | Implementation                        |
| --------------------------------- | -------------------------------------------------- | ------------------------------------- |
| SQL Injection                     | TypeORM parameterized queries                      | All database operations via TypeORM   |
| XSS (Cross-Site Scripting)        | React auto-escaping, GraphQL type validation       | React DOM, Apollo Client              |
| CSRF (Cross-Site Request Forgery) | JWT in headers (not cookies), CORS configuration   | Apollo Client, NestJS CORS            |
| Authentication Bypass             | GqlAuthGuard on all protected resolvers            | `@UseGuards(GqlAuthGuard)` decorator  |
| Password Attacks                  | bcrypt hashing, strong password requirements       | bcrypt (10 rounds), custom validators |
| Data Exposure                     | DTOs sanitize output, passwords never in responses | Service layer sanitization            |
| Mass Assignment                   | `whitelist: true` in ValidationPipe                | Global validation pipe configuration  |
| Injection Attacks                 | class-validator input validation, whitelisting     | DTO decorators, custom validators     |
| Brute Force                       | JWT expiration, can add rate limiting              | Passport JWT, ready for throttler     |
| Session Hijacking                 | Secure JWT tokens, HTTPS ready                     | JWT signature validation              |

### Validation Pipeline

```
Client Request
    ↓
GraphQL Schema Validation (type checking, required fields)
    ↓
DTO Validation (class-validator decorators, custom validators)
    ↓
Transform & Sanitize (class-transformer, trim, lowercase)
    ↓
Business Logic (services with additional checks)
    ↓
Entity Validation (TypeORM decorators, column constraints)
    ↓
Database (unique constraints, foreign keys, NOT NULL)
    ↓
Response Sanitization (remove passwords, sensitive fields)
    ↓
Client Response
```

### Security Checklist for Production

Before deploying to production:

- [ ] Set strong `JWT_SECRET` (64+ random characters)
- [ ] Enable HTTPS with valid SSL certificate
- [ ] Configure production CORS origins (no wildcards)
- [ ] Disable TypeORM `synchronize` (use migrations)
- [ ] Add rate limiting with `@nestjs/throttler`
- [ ] Add Helmet.js for security headers
- [ ] Set up monitoring and alerting
- [ ] Enable database backups
- [ ] Review and rotate secrets regularly
- [ ] Add CSP (Content Security Policy) headers
- [ ] Configure logging without sensitive data
- [ ] Test authentication flows thoroughly
- [ ] Perform security audit/penetration testing

## 📚 Third-Party Libraries & Tools

### Backend Dependencies

#### Core Framework

- **@nestjs/core** (10.4.20) - NestJS framework core
- **@nestjs/common** (10.4.20) - Common NestJS utilities and decorators
- **@nestjs/platform-express** (10.4.20) - Express platform adapter

#### GraphQL

- **@nestjs/graphql** (12.2.2) - NestJS GraphQL integration
- **@nestjs/apollo** (12.2.2) - Apollo Server integration for NestJS
- **@apollo/server** (4.12.2) - GraphQL server implementation
- **graphql** (16.12.0) - GraphQL.js implementation

#### Database

- **@nestjs/typeorm** (10.0.2) - TypeORM integration for NestJS
- **typeorm** (0.3.27) - TypeScript ORM for SQL databases
- **pg** (8.16.3) - PostgreSQL client for Node.js

#### Authentication

- **@nestjs/passport** (10.0.3) - Passport authentication integration
- **@nestjs/jwt** (11.0.1) - JWT utilities for NestJS
- **passport** (0.6.0) - Authentication middleware
- **passport-jwt** (4.0.1) - Passport JWT strategy
- **bcrypt** (5.1.1) - Password hashing library

#### Validation & Transformation

- **class-validator** (0.14.2) - Decorator-based validation
- **class-transformer** (0.5.1) - Object transformation utilities
- **@nestjs/mapped-types** (2.0.4) - Type mapping utilities (PartialType, etc.)

#### Utilities

- **reflect-metadata** (0.1.14) - Metadata reflection API (required by TypeORM)
- **rxjs** (7.8.2) - Reactive extensions for JavaScript

#### Development Tools

- **@nestjs/cli** (11.0.10) - NestJS command-line interface
- **@nestjs/schematics** (11.0.9) - NestJS code generation schematics
- **typescript** (5.9.3) - TypeScript compiler
- **ts-node** (10.9.2) - TypeScript execution engine
- **eslint** (9.38.0) - JavaScript/TypeScript linter
- **@types/node** (24.9.1) - Node.js type definitions
- **@types/bcrypt** (6.0.0) - bcrypt type definitions
- **@types/passport-jwt** (4.0.1) - Passport JWT type definitions

### Frontend Dependencies

#### Core Framework

- **react** (19.1.1) - React library
- **react-dom** (19.1.1) - React DOM renderer
- **vite** (rolldown-vite@7.1.14) - Fast build tool and dev server

#### State Management

- **@reduxjs/toolkit** (2.11.0) - Redux Toolkit for simplified Redux
- **react-redux** (9.2.0) - React bindings for Redux

#### GraphQL Client

- **@apollo/client** (4.0.9) - Apollo Client for GraphQL
- **graphql** (16.12.0) - GraphQL implementation

#### Routing

- **react-router-dom** (7.9.4) - React Router for client-side routing

#### UI Framework

- **bootstrap** (5.3.8) - Bootstrap CSS framework
- **@popperjs/core** (2.11.8) - Tooltip and popover positioning (Bootstrap
  dependency)

#### Development Tools

- **typescript** (5.9.3) - TypeScript compiler
- **@vitejs/plugin-react** (5.0.4) - Vite plugin for React
- **eslint** (9.36.0) - JavaScript/TypeScript linter
- **@eslint/js** (9.36.0) - ESLint JavaScript configurations
- **typescript-eslint** (8.45.0) - TypeScript ESLint plugin
- **eslint-plugin-react-hooks** (5.2.0) - ESLint plugin for React Hooks
- **eslint-plugin-react-refresh** (0.4.22) - ESLint plugin for React Fast
  Refresh
- **globals** (16.4.0) - Global identifiers for ESLint
- **@types/react** (19.1.16) - React type definitions
- **@types/react-dom** (19.1.9) - React DOM type definitions
- **@types/react-router-dom** (5.3.3) - React Router type definitions
- **@types/node** (24.6.0) - Node.js type definitions

### Root Dependencies

- **@nestjs/config** (4.0.2) - Configuration module for NestJS
- **joi** (18.0.1) - Schema validation for environment variables
- **@types/joi** (17.2.2) - Joi type definitions

### Why These Libraries?

**NestJS** - Enterprise-grade framework with:

- Built-in dependency injection
- Module-based architecture
- Extensive ecosystem
- TypeScript-first design
- Excellent documentation

**GraphQL + Apollo** - Modern API approach:

- Type-safe API contracts
- Efficient data fetching (no over/under-fetching)
- Self-documenting schema
- Strong tooling support
- Real-time capabilities ready

**TypeORM** - Production-ready ORM:

- TypeScript decorators for entities
- Automatic migrations
- Multiple database support
- Active Record and Data Mapper patterns
- Excellent TypeScript integration

**Redux Toolkit** - Modern Redux:

- Simplified Redux setup
- Built-in best practices
- Immer for immutable updates
- Redux DevTools integration
- Async thunk support

**React 19** - Latest React features:

- Improved concurrent rendering
- Automatic batching
- Modern hooks API
- Server Components ready
- Excellent TypeScript support

**Vite** - Next-generation build tool:

- Lightning-fast HMR (Hot Module Replacement)
- ESM-based dev server
- Optimized production builds
- Plugin ecosystem
- Rolldown integration for performance

**bcrypt** - Industry standard password hashing:

- Adaptive hashing (configurable rounds)
- Salt generation built-in
- Protection against rainbow tables
- NIST recommended

**class-validator** - Declarative validation:

- Decorator-based syntax
- Extensive built-in validators
- Custom validator support
- TypeScript integration
- Clear error messages

### License Information

All dependencies are open-source with permissive licenses (MIT, Apache 2.0,
ISC):

- No proprietary dependencies
- Safe for commercial use
- No viral copyleft licenses (GPL)

**Check licenses:**

```bash
# Backend
cd backend
npx license-checker --summary

# Frontend
cd frontend
npx license-checker --summary
```

### Keeping Dependencies Updated

**Check for updates:**

```bash
# Backend
cd backend
npm outdated

# Frontend
cd frontend
npm outdated
```

**Update dependencies:**

```bash
# Update to latest within semver range
npm update

# Update to latest (breaking changes possible)
npm install <package>@latest
```

**Security audits:**

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Fix including breaking changes
npm audit fix --force
```

## 🐛 Troubleshooting

### Common Issues & Solutions

#### Database Connection Errors

**Error:** `FATAL: password authentication failed for user "postgres"`

**Solution:**

1. Verify PostgreSQL is running:

   ```bash
   # Windows
   Get-Service postgresql*

   # macOS/Linux
   sudo service postgresql status
   ```

2. Check credentials in `backend/.env`
3. Test connection:
   ```bash
   psql -U postgres -d mathwithmarcy
   ```

**Error:** `database "mathwithmarcy" does not exist`

**Solution:**

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE mathwithmarcy;

-- Verify
\l
```

**Error:** `connect ECONNREFUSED ::1:5432`

**Solution:**

- PostgreSQL is not running or not listening on port 5432
- Check `DB_HOST` in `.env` (use `localhost` or `127.0.0.1`)
- Verify PostgreSQL port in `postgresql.conf`

#### JWT Authentication Errors

**Error:** `JsonWebTokenError: jwt malformed`

**Solution:**

- Token format is invalid
- Ensure Authorization header format: `Bearer YOUR_TOKEN`
- Get a fresh token via login mutation

**Error:** `TokenExpiredError: jwt expired`

**Solution:**

- Token has expired (1 day default, 30 days with remember)
- Log in again to get a new token

**Error:** `UnauthorizedException: No auth token`

**Solution:**

- Missing Authorization header
- Add header: `Authorization: Bearer YOUR_TOKEN`

#### GraphQL Errors

**Error:** `Cannot query field "xyz" on type "Query"`

**Solution:**

- Field doesn't exist in schema
- Check spelling and casing
- Review schema in GraphQL Playground (Docs tab)

**Error:** `Variable "$input" of required type "XyzInput!" was not provided`

**Solution:**

- Missing required input variable
- Add input to mutation/query
- Check required fields in schema

**Error:** `400 Bad Request: Validation failed`

**Solution:**

- Input doesn't meet validation rules
- Check error message for specific field
- Review validation rules in DTO files

#### Build Errors

**Error:** `Cannot find module '@nestjs/core'`

**Solution:**

```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

**Error:** TypeScript compilation errors

**Solution:**

1. Check TypeScript version compatibility
2. Clear build cache:
   ```bash
   cd backend
   rm -rf dist
   npm run build
   ```

**Error:** Vite build fails

**Solution:**

```bash
cd frontend
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

#### Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::3001`

**Solution:**

```bash
# Windows - Find and kill process
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process

# macOS/Linux
lsof -ti:3001 | xargs kill -9
```

**Error:** `Port 5173 is already in use`

**Solution:**

- Close other Vite dev servers
- Or change port in `frontend/vite.config.ts`:
  ```typescript
  export default defineConfig({
    server: { port: 5174 },
  });
  ```

#### CORS Errors

**Error:**
`Access to fetch at 'http://localhost:3001/graphql' blocked by CORS policy`

**Solution:**

- Ensure backend CORS is configured correctly in `main.ts`
- Check frontend is running on expected origin
- Clear browser cache and restart servers

#### Module Resolution Errors

**Error:** `Module not found: Error: Can't resolve 'xyz'`

**Solution:**

```bash
# Frontend
cd frontend
npm install xyz

# Backend
cd backend
npm install xyz
```

### Debug Mode

**Enable verbose logging:**

Backend (`backend/src/main.ts`):

```typescript
const app = await NestFactory.create(AppModule, {
  logger: ['error', 'warn', 'log', 'debug', 'verbose'],
});
```

**Check GraphQL queries:**

Frontend (`frontend/src/graphql/client.ts`):

```typescript
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([
    new ApolloLink((operation, forward) => {
      console.log('GraphQL Request:', operation);
      return forward(operation);
    }),
    authLink,
    httpLink,
  ]),
});
```

### Getting Help

1. **Check logs:**

   - Backend: Terminal where `npm run start:dev` is running
   - Frontend: Browser console (F12 → Console)

2. **Review documentation:**

   - [GRAPHQL_API_REFERENCE.md](./GRAPHQL_API_REFERENCE.md)
   - [BACKEND_API_DOCUMENTATION.md](./BACKEND_API_DOCUMENTATION.md)

3. **GraphQL Playground:**

   - Test queries at http://localhost:3001/graphql
   - View schema documentation
   - Check query syntax

4. **Database inspection:**

   ```bash
   psql -U postgres -d mathwithmarcy

   -- View tables
   \dt

   -- View table structure
   \d users
   \d questions
   \d user_answers

   -- Query data
   SELECT * FROM users;
   SELECT * FROM questions LIMIT 10;
   ```

5. **Clear everything and restart:**

   ```bash
   # Stop all servers (Ctrl+C)

   # Backend
   cd backend
   rm -rf node_modules dist package-lock.json
   npm install
   npm run build
   npm run start:dev

   # Frontend (new terminal)
   cd frontend
   rm -rf node_modules dist package-lock.json
   npm install
   npm run dev
   ```

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Commit your changes:** `git commit -m 'Add amazing feature'`
4. **Push to branch:** `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style (ESLint configuration)
- Write meaningful commit messages
- Add JSDoc comments to new methods
- Update documentation for API changes
- Test thoroughly before submitting PR

### Code Style

**Backend (NestJS):**

- Use dependency injection
- Follow module-based architecture
- Add comprehensive error handling
- Use DTOs for all inputs
- Document all service methods with JSDoc

**Frontend (React):**

- Use functional components with hooks
- Follow Redux Toolkit patterns
- Use TypeScript for type safety
- Keep components focused and reusable
- Use semantic HTML and ARIA labels

## 📄 License

This project is open source and available under the **MIT License**.

```
MIT License

Copyright (c) 2025 MathWithMarcy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 👨‍💻 Author

Created with 💝 by EliseTrad for students who want to make math fun!

## 🌟 Acknowledgments

- **Marcy** from Adventure Time for being an awesome mascot
- **NestJS Team** for the excellent framework
- **React Team** for the amazing library
- **TypeORM Team** for the powerful ORM
- **Apollo Team** for GraphQL tools
- **Open Source Community** for all the amazing libraries

---

## 📞 Support

For questions, issues, or feature requests:

- **GitHub Issues:**
  [https://github.com/EliseTrad/MathWithMarcy/issues](https://github.com/EliseTrad/MathWithMarcy/issues)
- **Documentation:** Review
  [GRAPHQL_API_REFERENCE.md](./GRAPHQL_API_REFERENCE.md) and
  [BACKEND_API_DOCUMENTATION.md](./BACKEND_API_DOCUMENTATION.md)

---

**Happy Learning with Marcy!** 🎓✨

---

_Last Updated: December 9, 2025_
