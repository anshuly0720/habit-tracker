# HabitFlow - Development Approach Document

## Overview

This document outlines the approach taken to build HabitFlow, a full-stack habit tracking web application with social accountability features.

## Technology Choices

### Why Next.js 14?

I chose Next.js 14 with the App Router for several key reasons:

1. **Full-Stack in One Framework** - Next.js allows building both frontend and backend API routes in a single codebase, simplifying deployment and development.

2. **Server Components** - The App Router's server components enable fetching data directly on the server, reducing client-side JavaScript and improving performance.

3. **Built-in Authentication Support** - NextAuth.js (now Auth.js) integrates seamlessly with Next.js, providing secure session management out of the box.

4. **Vercel Deployment** - Next.js deploys effortlessly to Vercel with zero configuration.

### Why PostgreSQL with Prisma?

1. **Relational Data Model** - The application has clear relationships (users → habits → completions, users → follows), making a relational database the natural choice.

2. **Type Safety** - Prisma generates TypeScript types from the schema, catching errors at compile time rather than runtime.

3. **Migration Management** - Prisma handles schema migrations gracefully, making it easy to evolve the database over time.

### Why Tailwind CSS?

1. **Rapid Development** - Utility classes enable fast styling without context-switching between files.

2. **Dark Theme Support** - Easy to implement consistent dark theming with custom color variables.

3. **Production Optimization** - Tailwind purges unused styles, resulting in minimal CSS bundle size.

## Architecture Decisions

### API Design

I implemented RESTful API routes with consistent patterns:
- `GET /api/habits` - List resources
- `POST /api/habits` - Create resource
- `PUT /api/habits/[id]` - Update resource
- `DELETE /api/habits/[id]` - Delete resource

Each route includes:
- Authentication check
- Input validation with Zod
- Proper error handling with meaningful messages
- Appropriate HTTP status codes

### State Management

Rather than using a global state library (Redux, Zustand), I opted for:
- React's built-in `useState` and `useCallback` hooks
- Server-side data fetching where appropriate
- Component-level state with prop drilling for simple cases

This keeps the codebase simple and avoids unnecessary complexity.

### Authentication Flow

1. **Registration** - Password hashed with bcrypt (12 rounds), stored in database
2. **Login** - Credentials verified against stored hash
3. **Session** - JWT-based sessions stored in HTTP-only cookies
4. **Protection** - Middleware protects dashboard routes, API routes check session

## Challenges & Solutions

### Challenge 1: Streak Calculation

**Problem:** Calculating accurate streaks across daily and weekly habits with different time zones.

**Solution:** Created a utility module (`utils.ts`) with functions for:
- Determining period boundaries (start/end of day/week)
- Calculating consecutive completions
- Handling edge cases like gaps in completion history

The streak resets if more than one period passes without a completion.

### Challenge 2: Duplicate Prevention

**Problem:** Preventing users from checking in multiple times per period or creating duplicate habits.

**Solution:** 
- **Duplicate habits:** Added a unique constraint `@@unique([userId, name])` in Prisma schema
- **Duplicate check-ins:** Query for existing completions within the current period before creating new ones

### Challenge 3: Self-Follow Prevention

**Problem:** Users shouldn't be able to follow themselves.

**Solution:** Added explicit validation in the follow API route comparing `followerId` with `followingId`.

### Challenge 4: Real-Time UI Updates

**Problem:** After completing a habit, the UI should reflect changes immediately.

**Solution:** Implemented optimistic updates where the UI updates immediately, then fetches fresh data from the server to ensure consistency.

## Performance Considerations

1. **Database Queries** - Used `include` for related data to minimize round trips
2. **Pagination** - Activity feed limited to 50 items
3. **Debounced Search** - User search waits 300ms before querying
4. **Lazy Loading** - Pages load data after initial render with loading states

## Security Measures

1. **Password Hashing** - bcrypt with salt rounds of 12
2. **Session Encryption** - NextAuth uses encrypted JWTs
3. **Input Validation** - Zod schemas validate all user input
4. **SQL Injection Prevention** - Prisma parameterizes all queries
5. **CSRF Protection** - Built into NextAuth

## Future Improvements

Given more time, I would add:

1. **Email Notifications** - Reminders for missed habits
2. **Data Export** - Allow users to download their habit history
3. **Habit Templates** - Pre-built habits for common goals
4. **Mobile App** - React Native version for better mobile experience
5. **Advanced Analytics** - Charts and trends over time

## Conclusion

Building HabitFlow demonstrated the power of modern full-stack development with Next.js. The combination of server components, API routes, and type-safe database access with Prisma made it possible to build a feature-rich application efficiently while maintaining code quality and security.

---

*Document prepared as part of the HabitFlow project deliverables*
