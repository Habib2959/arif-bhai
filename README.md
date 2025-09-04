# Production-Ready Authentication & Authorization System

A complete authentication and authorization system built with **NestJS**, **Next.js**, **PostgreSQL**, and **better-auth**. This system provides secure user authentication, role-based access control, and granular permissions.

## 🚀 Features

### Authentication

- **Email/Password Authentication** using better-auth
- **Secure Session Management** with httpOnly cookies
- **Password Hashing** with Argon2
- **Session Refresh** with rotation support
- **CSRF Protection**

### Authorization

- **Role-Based Access Control** (Admin, HR, Employee)
- **Granular Permissions** system
- **Hierarchical Role Inheritance**
- **Server-side Route Protection**
- **Client-side Conditional Rendering**

### Security Features

- **Helmet** for security headers
- **Rate Limiting** with @nestjs/throttler
- **CORS** configuration
- **Input Validation** with class-validator
- **SQL Injection Protection** via better-auth

### Developer Experience

- **Swagger API Documentation** at `/docs`
- **TypeScript** throughout
- **Hot Reload** in development
- **Docker Compose** for PostgreSQL
- **Monorepo Structure** with workspaces

## 📁 Project Structure

```
/
├── apps/
│   ├── api/                    # NestJS Backend
│   │   ├── src/
│   │   │   ├── auth/           # Authentication module
│   │   │   │   ├── auth.config.ts      # better-auth configuration
│   │   │   │   ├── auth.controller.ts  # Auth routes handler
│   │   │   │   ├── auth.service.ts     # Auth business logic
│   │   │   │   ├── guards/             # Auth, Roles, Permissions guards
│   │   │   │   └── decorators/         # Custom decorators
│   │   │   ├── users/          # Users module
│   │   │   └── main.ts         # App bootstrap
│   │   └── package.json
│   │
│   └── web/                    # Next.js Frontend
│       ├── src/
│       │   ├── app/            # App Router pages
│       │   │   ├── login/      # Login page
│       │   │   ├── register/   # Register page
│       │   │   ├── dashboard/  # Protected dashboard
│       │   │   └── admin/      # Admin-only pages
│       │   ├── components/     # React components
│       │   │   ├── auth/       # Auth forms
│       │   │   └── ui/         # UI components
│       │   └── lib/            # Utilities & configurations
│       └── package.json
│
├── docker-compose.yml          # PostgreSQL container
├── init.sql                   # Database initialization
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- npm or yarn

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd auth-system

# Install root dependencies
npm install

# Install all workspace dependencies
npm run install:all
```

### 2. Environment Setup

Copy the environment files:

```bash
# Copy root environment
cp .env.example .env

# Copy API environment
cp apps/api/.env.example apps/api/.env

# Copy Web environment
cp apps/web/.env.example apps/web/.env
```

Update the environment variables as needed. The defaults should work for local development.

### 3. Start PostgreSQL

```bash
# Start PostgreSQL container
docker compose up -d

# Verify it's running
docker compose ps
```

The database will be initialized with the schema defined in `init.sql`.

### 4. Start the Applications

```bash
# Start both API and Web in development mode
npm run dev
```

Or start them individually:

```bash
# Terminal 1: Start API server
npm run dev:api

# Terminal 2: Start Web server
npm run dev:web
```

### 5. Access the Applications

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001
- **API Docs**: http://localhost:3001/docs

## 🔑 Authentication Flow

### Registration Flow

1. User fills registration form with name, email, password, and role
2. Frontend validates input using Zod schemas
3. Request sent to `/auth/sign-up` endpoint via better-auth
4. Password hashed with Argon2, user stored in database
5. Session created and httpOnly cookie set
6. User redirected to dashboard

### Login Flow

1. User submits email/password via login form
2. Frontend validates credentials
3. Request sent to `/auth/sign-in` endpoint
4. better-auth verifies credentials against database
5. Session created with secure cookie
6. User redirected to dashboard

### Session Management

- Sessions stored in PostgreSQL with expiration
- httpOnly + Secure + SameSite cookies
- Automatic refresh when session approaches expiration
- Logout clears session from database and cookies

## 👥 Authorization System

### Roles Hierarchy

- **Admin**: Full system access
- **HR**: Employee management capabilities
- **Employee**: Basic dashboard access

### Permission System

- `can_view_dashboard`: View dashboard (all roles)
- `can_manage_users`: Manage users (admin only)
- `can_manage_employees`: Manage employees (admin, hr)

### Server-Side Protection

```typescript
// Protect routes with guards
@UseGuards(AuthGuard, RolesGuard)
@Roles('admin')
@Get('users')
getAllUsers() {
  // Admin only endpoint
}

// Check permissions
@UseGuards(AuthGuard, PermissionsGuard)
@Permissions('can_manage_users')
@Post('users')
createUser() {
  // Requires specific permission
}
```

### Client-Side Protection

```typescript
// Conditional rendering based on permissions
{canManageUsers(user) && (
  <Button onClick={() => router.push('/admin/users')}>
    Manage Users
  </Button>
)}

// Route protection in middleware
if (!session && isProtectedRoute) {
  return redirect('/login');
}
```

## 🔧 API Endpoints

### Authentication Routes (via better-auth)

- `POST /auth/sign-up` - User registration
- `POST /auth/sign-in` - User login
- `POST /auth/sign-out` - User logout
- `GET /auth/session` - Get current session
- `POST /auth/refresh` - Refresh session token

### Protected Routes

- `GET /users` - Get all users (admin only)
- `GET /users/me` - Get current user profile
- More endpoints can be added following the same pattern

## 🧪 Testing the System

### Test User Accounts

You can create test accounts with different roles:

1. **Admin User**
   - Email: admin@example.com
   - Password: admin123
   - Role: admin
   - Permissions: can_view_dashboard, can_manage_users

2. **HR User**
   - Email: hr@example.com
   - Password: hr123
   - Role: hr
   - Permissions: can_view_dashboard, can_manage_employees

3. **Employee User**
   - Email: employee@example.com
   - Password: employee123
   - Role: employee
   - Permissions: can_view_dashboard

### Testing Workflow

1. Register new users via `/register` page
2. Login with different roles via `/login` page
3. Access `/dashboard` to see role-based features
4. Try accessing `/admin/users` with different roles
5. Check API documentation at `/docs`

## 🔒 Security Features

### Password Security

- Argon2 hashing via better-auth
- Minimum 6 character requirement
- No plaintext password storage

### Session Security

- HttpOnly cookies prevent XSS attacks
- Secure flag for HTTPS
- SameSite=strict prevents CSRF
- Automatic session expiration
- Session rotation on refresh

### API Security

- Helmet for security headers
- Rate limiting (10 requests/minute)
- CORS configuration
- Input validation with class-validator
- SQL injection protection

### Infrastructure Security

- Database credentials in environment variables
- Secrets rotation support
- Docker container isolation

## 🚀 Production Deployment

### Environment Variables

Set these environment variables for production:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# better-auth
BETTER_AUTH_SECRET="very-long-random-secret-string-here"
BETTER_AUTH_URL="https://your-api-domain.com"

# API
API_PORT=3001
CORS_ORIGIN="https://your-frontend-domain.com"

# Next.js
NEXT_PUBLIC_API_URL="https://your-api-domain.com"
NEXTAUTH_URL="https://your-frontend-domain.com"
```

### Build Commands

```bash
# Build both applications
npm run build

# Start in production mode
npm run start
```

### Docker Deployment

The system can be containerized using Docker. The `docker-compose.yml` provides the PostgreSQL database, and you can extend it to include the API and web applications.

## 📚 Additional Resources

### better-auth Documentation

- [Official Docs](https://better-auth.com)
- [PostgreSQL Adapter](https://better-auth.com/docs/adapters/postgres)
- [Session Management](https://better-auth.com/docs/concepts/sessions)

### NestJS Resources

- [Guards Documentation](https://docs.nestjs.com/guards)
- [Custom Decorators](https://docs.nestjs.com/custom-decorators)
- [Swagger Integration](https://docs.nestjs.com/openapi/introduction)

### Next.js Resources

- [App Router](https://nextjs.org/docs/app)
- [Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Authentication Patterns](https://nextjs.org/docs/app/building-your-application/authentication)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

---

**Built with ❤️ using NestJS, Next.js, PostgreSQL, and better-auth**
