# ShopStack - E-Commerce Product Catalog

A modern, full-stack e-commerce product catalog built with Next.js, Prisma, PostgreSQL, and NextAuth.js featuring Server-Side Rendering (SSR), user authentication, and shopping cart management.

## 🚀 Features

- **Server-Side Rendering (SSR)**: Product listing and detail pages rendered on the server for optimal performance and SEO
- **User Authentication**: Secure OAuth authentication with NextAuth.js (GitHub provider)
- **Shopping Cart**: Full cart management with protected API routes
- **Search & Pagination**: Server-side product search and pagination
- **Database**: PostgreSQL with Prisma ORM
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS and shadcn/ui
- **Docker Support**: Full containerization with Docker Compose
- **Form Validation**: Request body validation with Zod
- **Protected Routes**: Middleware-based route protection

## 📋 Prerequisites

- Node.js 18+ and Yarn
- PostgreSQL 15+
- Docker and Docker Compose (for containerized deployment)
- GitHub OAuth App (for authentication)

## 🛠️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd /app
yarn install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in the required values:

```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: Your application URL
- `NEXTAUTH_SECRET`: Random secret for NextAuth.js (min 32 characters)
- `GITHUB_ID`: GitHub OAuth Client ID
- `GITHUB_SECRET`: GitHub OAuth Client Secret

### 3. Set Up GitHub OAuth

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: ShopStack
   - **Homepage URL**: Your application URL
   - **Authorization callback URL**: `{YOUR_URL}/api/auth/callback/github`
4. Copy the Client ID and generate a Client Secret
5. Add them to your `.env` file

### 4. Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed the database
node prisma/seed.js
```

### 5. Run the Application

**Development:**
```bash
yarn dev
```

**Production:**
```bash
yarn build
yarn start
```

**Docker:**
```bash
docker-compose up
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
/app/
├── pages/                    # Next.js Pages Router
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth].js  # NextAuth.js configuration
│   │   └── cart.js              # Cart API endpoints
│   ├── auth/
│   │   └── signin.js            # Custom sign-in page
│   ├── products/
│   │   └── [id].js              # Product detail page (SSR)
│   ├── cart.js                   # Shopping cart page (protected)
│   ├── index.js                  # Home page with product listing (SSR)
│   └── _app.js                   # App wrapper with SessionProvider
├── prisma/
│   ├── schema.prisma            # Database schema
│   ├── seed.js                  # Database seed script
│   └── seed-data/               # SQL initialization scripts
├── lib/
│   └── prisma.js                # Prisma client instance
├── components/
│   └── ui/                      # shadcn/ui components
├── middleware.js                # Route protection middleware
├── docker-compose.yml           # Docker Compose configuration
├── Dockerfile                   # Docker image configuration
├── .env.example                 # Environment variables template
└── submission.json              # Test user credentials
```

## 🗄️ Database Schema

### Models

- **User**: NextAuth.js user model with authentication data
- **Account**: OAuth account linking
- **Session**: User session management
- **Product**: E-commerce products
- **Cart**: User shopping carts
- **CartItem**: Cart line items with product references

## 🔐 API Endpoints

### Authentication
- `GET /api/auth/signin` - Sign in page
- `GET /api/auth/signout` - Sign out
- `GET /api/auth/providers` - List available providers

### Cart Management (Protected)
- `GET /api/cart` - Get cart contents
- `POST /api/cart` - Add item to cart
  ```json
  {
    "productId": "string",
    "quantity": number
  }
  ```
- `DELETE /api/cart` - Remove item from cart
  ```json
  {
    "productId": "string"
  }
  ```

## 🧪 Testing

### Test User
A test user is seeded in the database with the following credentials (see `submission.json`):
- **Email**: test.user@example.com
- **Name**: Test User

### Data Test IDs
All interactive elements have `data-testid` attributes for E2E testing:

**Product List Page:**
- `search-input` - Search input field
- `search-button` - Search submit button
- `product-card-{productId}` - Product card container
- `add-to-cart-button-{productId}` - Add to cart button
- `pagination-next` - Next page button
- `pagination-prev` - Previous page button

**Product Detail Page:**
- `product-name` - Product name
- `product-price` - Product price
- `product-description` - Product description
- `add-to-cart-button` - Add to cart button

**Cart Page:**
- `cart-item-{productId}` - Cart item container
- `remove-item-button-{productId}` - Remove item button
- `quantity-input-{productId}` - Quantity input
- `cart-total` - Cart total price

**Authentication:**
- `signin-button` - Sign in button
- `signout-button` - Sign out button

## 🐳 Docker Deployment

The project includes full Docker support with health checks and automatic database seeding:

```bash
# Start all services
docker-compose up

# Stop services
docker-compose down

# Rebuild and start
docker-compose up --build
```

The `docker-compose.yml` includes:
- PostgreSQL database with health checks
- Next.js application (depends on healthy database)
- Automatic migration and seeding on startup
- Volume persistence for database data

## 🔒 Security Features

- **Protected Routes**: Middleware-based authentication for `/cart`
- **API Route Protection**: Cart API endpoints require authentication
- **Request Validation**: Zod schema validation for all POST/DELETE requests
- **CSRF Protection**: Built-in with NextAuth.js
- **Environment Variables**: Sensitive data stored in environment variables

## 🎨 UI Components

Built with:
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality, accessible React components
- **Lucide React**: Beautiful icon system
- **Sonner**: Toast notifications

## 📝 Core Requirements Checklist

✅ Docker Compose with automated setup
✅ Prisma schema with User, Product, Cart, CartItem models
✅ .env.example with all required variables
✅ submission.json with test user credentials
✅ NextAuth.js with OAuth provider (GitHub)
✅ SSR product listing page with search & pagination
✅ SSR product detail pages
✅ Protected cart API routes (GET, POST, DELETE)
✅ Protected cart page with middleware
✅ Zod validation for API requests
✅ data-testid attributes throughout the application

## 🚧 Development Notes

- Hot reload is enabled in development mode
- PostgreSQL must be running before starting the application
- Run `npx prisma studio` to view/edit database in the browser
- Use `npx prisma migrate reset` to reset database and re-seed

## 📄 License

MIT

## 🤝 Contributing

This project is part of a technical assessment. For production use, consider adding:
- Payment integration (Stripe, PayPal)
- Order management system
- Email notifications
- Advanced search with filters
- Product reviews and ratings
- Admin dashboard
- Image upload functionality
- Stock management
