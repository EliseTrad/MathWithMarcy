# MathWithMarcy

A fun and engaging gamified math learning platform featuring Marcy from
Adventure Time! Practice math problems across different topics and difficulty
levels while tracking your progress.

![MathWithMarcy](./frontend/public/marcy.png)

## eatures

- **Practice Math** - Interactive math problems across multiple topics
- **Track Progress** - Detailed statistics grouped by topic and difficulty
- **Beautiful UI** - Modern, responsive design with a fun theme
- **User Authentication** - Secure login and registration with JWT
- **Personalized Dashboard** - View your performance and statistics
- **Real-time Feedback** - Instant feedback on answers with hints

## Topics Available

- Geometry
- Arithmetic
- Algebra
- Word Problem

Each topic has three difficulty levels: **Easy**, **Medium**, and **Hard**.

## Tech Stack

### Frontend

- **React 19** with TypeScript
- **Vite** for build tooling
- **React Router** for navigation
- **Axios** for API communication
- **Bootstrap 5** for styling

### Backend

- **NestJS** framework
- **TypeORM** for database operations
- **PostgreSQL** database
- **JWT** for authentication
- **Passport** for auth strategies
- **bcrypt** for password hashing

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn
- TypeScript knowledge (project is fully written in TypeScript)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd MathWithMarcy
   ```

2. **Install root dependencies**

   ```bash
   npm install
   ```

3. **Setup Backend**

   ```bash
   cd backend
   npm install
   ```

4. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Database Setup

1. **Create PostgreSQL database**

   ```sql
   CREATE DATABASE mathwithmarcy;
   ```

2. **Create environment file**

   Create `backend/.env` with:

   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=your_postgres_username
   DB_PASSWORD=your_postgres_password
   DB_NAME=mathwithmarcy
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=3000
   ```

3. **Run migrations** (if applicable)

   The database schema will be created automatically by TypeORM when you start
   the backend.

### Running the Application

#### Development Mode

1. **Start Backend** (in `backend/` directory)

   ```bash
   npm run start:dev
   ```

   Backend runs on `http://localhost:3000`

2. **Start Frontend** (in `frontend/` directory)
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

#### Production Build

1. **Build Backend**

   ```bash
   cd backend
   npm run build
   npm start
   ```

2. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   npm run preview
   ```

## Project Structure

```
MathWithMarcy/
├── backend/
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management
│   │   ├── questions/      # Question management
│   │   ├── user-answers/   # Answer tracking & statistics
│   │   ├── app.module.ts   # Root module
│   │   └── main.ts         # Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── public/
│   │   ├── marcy.png       # Marcy mascot
│   │   └── bg.png          # Background image
│   ├── src/
│   │   ├── api/            # API client functions
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utility functions
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # Entry point
│   ├── package.json
│   └── vite.config.ts
│
├── .gitignore
├── package.json
└── README.md
```

## How to Use

1. **Register an Account** - Create your profile to start learning
2. **Login** - Access your personalized dashboard
3. **Choose a Topic** - Select from Geometry, Arithmetic, Algebra and Word
   Problem
4. **Select Difficulty** - Easy, Medium, or Hard
5. **Practice** - Answer questions and get instant feedback
6. **Track Progress** - View your statistics by topic and difficulty on the
   dashboard

## API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Users

- `GET /users` - Get all users (admin)
- `GET /users/:id` - Get user by ID
- `PATCH /users` - Update user profile
- `PATCH /users/password` - Change password
- `DELETE /users` - Delete account

### Questions

- `GET /questions` - Get questions (with filters)
- `POST /questions/:id/answer` - Submit answer
- `GET /questions/:id` - Get specific question
- `POST /questions` - Create question (admin)
- `PATCH /questions/:id` - Update question (admin)
- `DELETE /questions/:id` - Delete question (admin)

### Statistics

- `GET /user-answers/statistics/me` - Get user's statistics
- `GET /user-answers` - Get all user answers
- `GET /user-answers/:id` - Get specific answer

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Author

Created with 💝 for students who want to make math fun!

---

**Happy Learning with Marcy!**
