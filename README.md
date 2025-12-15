# HabitFlow - Habit Tracker Web App

A modern, full-stack habit tracking application with social accountability features. Build better habits, track your progress, and stay motivated with friends.

![HabitFlow Dashboard](https://via.placeholder.com/800x400?text=HabitFlow+Dashboard)

## 🌟 Features

### Core Functionality
- **User Authentication** - Secure registration, login, and session management
- **Habit Management** - Create, edit, and delete habits with customizable categories
- **Daily/Weekly Tracking** - Mark habits as complete with streak tracking
- **Progress Analytics** - View completion rates and streak statistics

### Social Features
- **Find Friends** - Search and follow other users
- **Activity Feed** - See friends' recent check-ins and streaks
- **Leaderboard** - Compete with others based on total streaks

### Edge Case Handling
- ✅ Prevents duplicate habit names per user
- ✅ Prevents multiple check-ins per day/week
- ✅ Prevents users from following themselves
- ✅ Form validation on all inputs

## 🚀 Live Demo

**Deployed URL:** [Your deployed URL here]

**Test Account:**
- Email: `demo@example.com`
- Password: `demo123`

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | NextAuth.js v5 |
| Deployment | Vercel + Railway |

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (local or hosted)
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd habit-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database URL (PostgreSQL)
   DATABASE_URL="postgresql://username:password@localhost:5432/habit_tracker?schema=public"

   # NextAuth Configuration
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

   Generate a secret key:
   ```bash
   openssl rand -base64 32
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Push schema to database
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the app**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄 Database Schema

```
User
├── id (string, PK)
├── email (string, unique)
├── username (string, unique)
├── password (string, hashed)
├── createdAt, updatedAt
└── Relations: habits, completions, followers, following

Habit
├── id (string, PK)
├── name (string)
├── category (string)
├── frequency (DAILY | WEEKLY)
├── currentStreak, longestStreak
├── userId (FK)
└── Relations: user, completions

HabitCompletion
├── id (string, PK)
├── completedAt (datetime)
├── habitId (FK)
└── userId (FK)

Follow
├── id (string, PK)
├── followerId (FK)
├── followingId (FK)
└── createdAt
```

## 🐳 Docker (Bonus Feature)

### Using Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Run database migrations
docker-compose exec app npx prisma db push
```

### Docker Commands

```bash
# Build the image
docker build -t habit-tracker .

# Run the container
docker run -p 3000:3000 --env-file .env habit-tracker
```

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/           # Auth pages (login, register)
│   ├── (dashboard)/      # Protected dashboard pages
│   ├── api/              # API routes
│   └── page.tsx          # Landing page
├── components/
│   ├── ui/               # Reusable UI components
│   ├── habits/           # Habit-related components
│   ├── users/            # User-related components
│   ├── feed/             # Activity feed components
│   └── layout/           # Layout components
├── lib/
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Utility functions
└── types/                # TypeScript declarations
```

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `NEXTAUTH_SECRET` | Secret for session encryption | ✅ |
| `NEXTAUTH_URL` | App URL (auto-set on Vercel) | ✅ (local only) |

## 🚢 Deployment

### Vercel (Frontend + API)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy!

### Railway (Database)

1. Create a new PostgreSQL database on Railway
2. Copy the connection string to your environment variables
3. Run `npx prisma db push` to initialize schema

## 📝 Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
npx prisma studio # Open Prisma database viewer
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ using Next.js, Prisma, and Tailwind CSS
