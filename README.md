# BlogHub - Multi-User Blogging Platform

A modern, full-stack blogging platform built with **Next.js 15**, **Express.js**, **tRPC**, **PostgreSQL**, and **Drizzle ORM**.

## Live Demo

- **Frontend**:
  [https://bloghub-demo.vercel.app](https://bloghub-demo.vercel.app)

- **Backend API**:
  [https://bloghub-api.onrender.com](https://bloghub-api.onrender.com)

## Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Setup Instructions](#-setup-instructions)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Trade-offs & Decisions](#-trade-offs--decisions)
- [Time Spent](#-time-spent)

## Features

### Priority 1 (Core Requirements) COMPLETE

#### Database Design and Implementation

- PostgreSQL database setup with Drizzle ORM
- Posts table (id, title, slug, content, status, createdAt, updatedAt)
- Categories table (id, name, slug, description, createdAt)
- Post-category relationships (many-to-many junction table)
- Proper indexes and relationships configured

#### Backend API (tRPC)

- **Posts Router**
  - `createPost` - Create new blog post with categories
  - `getPosts` - Get all posts with filtering (status, category, pagination)
  - `getPostBySlug` - Get individual post by slug
  - `updatePost` - Update post title, content, status, categories
  - `deletePost` - Delete post
  - `publishPost` - Publish draft post
- **Categories Router**
  - `createCategory` - Create new category
  - `getCategories` - Get all categories
  - `updateCategory` - Update category
  - `deleteCategory` - Delete category
- Zod schema validation for all inputs
- Slug generation for posts and categories
- Error handling and type safety
- tRPC middleware for request validation

#### Frontend UI

- **Landing Page** (3+ sections)
  - Hero section with CTA buttons
  - Features section (3 feature cards)
  - Latest posts section
  - Footer with links
- **Blog Listing Page**
  - Display all published posts
  - Category filtering
  - Pagination support
  - Blog card component with metadata
- **Individual Post View**
  - Full post content with markdown rendering
  - Post metadata (date, reading time)
  - Category tags with links
  - Navigation back to blog
- **Responsive Navigation**
  - Mobile hamburger menu
  - Links to blog, dashboard, create post
  - Sticky navigation bar
- **Clean, Professional UI**
  - Tailwind CSS styling
  - Consistent color scheme
  - Responsive design (mobile-first)
  - Proper spacing and typography

#### State Management & Data Fetching

- React Query (TanStack Query) via tRPC integration
- Automatic caching and refetching
- Loading states on all pages
- Error handling and user feedback
- Type-safe API calls with tRPC hooks

### Priority 2 (Expected Features) COMPLETE

#### Dashboard

- **Dashboard Home Page**
  - Statistics cards (total posts, published, drafts)
  - Recent posts list
  - Quick links to manage posts and categories
- **Posts Management Page**
  - Table view of all posts
  - Filter by status (all, published, draft)
  - Edit and delete actions
  - Create new post button
- **Create Post Page**
  - Title input
  - Markdown editor with preview
  - Category selection (multi-select)
  - Status selection (draft/published)
  - Form validation
- **Edit Post Page**
  - Pre-populated form with existing data
  - Update all post fields
  - Publish draft button
  - Delete post option
- **Categories Management Page**
  - Create new category form
  - List existing categories
  - Delete category option
  - Category description support

#### Content & Status

- Draft vs Published post status
- Status filtering on blog listing
- Status indicators in dashboard
- Publish action for draft posts

#### Editor

- Markdown editor with live preview
- Edit and preview tabs
- Syntax highlighting support
- Full markdown rendering

#### UX/Responsiveness

- Mobile-responsive design
- Tablet-friendly layouts
- Desktop optimized views
- Loading states on all async operations
- Error messages for failed operations
- Success feedback for actions

### Priority 3 (Bonus Features) IMPLEMENTED

- **Post Statistics**
  - Reading time calculation
  - Word count in metadata
- **Pagination**
  - Pagination on blog listing page
  - Configurable page size
  - Previous/Next navigation
- **SEO Meta Tags**
  - Page title and description
  - Metadata in layout
- **Post Preview**
  - Markdown preview in editor
  - Content truncation in cards
- **Search Functionality**
  - Category-based filtering
  - Status-based filtering

## Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **tRPC** - Type-safe API client
- **React Query** - Data fetching and caching
- **Markdown-it** - Markdown rendering
- **Zod** - Schema validation
- **Zustand** - State management
- **Lucide React** - Icons

### Backend

- **Express.js** - Node.js web framework
- **JavaScript** - Backend language
- **tRPC** - Type-safe RPC framework
- **Drizzle ORM** - Database ORM
- **PostgreSQL** - Database (Neon recommended)
- **Zod** - Schema validation
- **CORS** - Cross-origin resource sharing

## Setup Instructions

### Prerequisites

- Node.js 18+
- PostgreSQL (hosted: **Neon**)
- npm

### Quick Start

#### 1. Clone the Repository

```bash
git clone https://github.com/vishnuu5/BlogHub---Multi-User-Blogging-Platform.git
cd bloghub
```

#### 2. Install Dependencies

**Backend:**

```bash
cd server
npm install
```

**Frontend:**

```bash
cd ../client
npm install
```

#### 3. Database Setup

**Neon Database**

1. Go to [neon.tech](https://neon.tech)
2. Sign up for free account
3. Create a new project
4. Copy the connection string

#### 4. Environment Variables

**Backend (.env)**

```bash
cd server
cp .env
```

Edit `server/.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/bloghub
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

**Frontend (.env.local)**

```bash
cd ../client
"NEXT_PUBLIC_API_URL=http://localhost:3001" > .env
```

#### 5. Initialize Database

```bash
cd server

# Run migrations (creates tables)
npm run migrate

# Seed sample data
npm run seed
```

#### 6. Start Development Servers

**Terminal 1 - Backend:**

```bash
cd server
npm run dev
# Server runs on http://localhost:3001
```

**Terminal 2 - Frontend:**

```bash
cd client
npm run dev
# App runs on http://localhost:3000
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## API Documentation

### tRPC Routers

#### Posts Router (`posts.*`)

- `getPosts(input?)` - Get posts with optional filtering

  - `status?: "draft" | "published"` - Filter by status
  - `categoryId?: number` - Filter by category
  - `limit?: number` - Items per page (default: 10)
  - `offset?: number` - Pagination offset (default: 0)
  - Returns: `{ posts: Post[], total: number }`

- `createPost(input)` - Create new post

  - `title: string` - Post title (1-255 chars)
  - `content: string` - Post content (markdown)
  - `status?: "draft" | "published"` - Initial status
  - `categoryIds?: number[]` - Category IDs to assign
  - Returns: `Post`

- `getPostBySlug(slug)` - Get post by slug

  - `slug: string` - Post slug
  - Returns: `Post | null`

- `updatePost(input)` - Update post

  - `id: number` - Post ID
  - `title?: string` - New title
  - `content?: string` - New content
  - `status?: "draft" | "published"` - New status
  - `categoryIds?: number[]` - New categories
  - Returns: `Post`

- `deletePost(id)` - Delete post

  - `id: number` - Post ID
  - Returns: `{ success: boolean }`

- `publishPost(id)` - Publish draft post
  - `id: number` - Post ID
  - Returns: `Post`

#### Categories Router (`categories.*`)

- `getCategories()` - Get all categories

  - Returns: `Category[]`

- `createCategory(input)` - Create new category

  - `name: string` - Category name (1-100 chars)
  - `description?: string` - Category description
  - Returns: `Category`

- `updateCategory(input)` - Update category

  - `id: number` - Category ID
  - `name?: string` - New name
  - `description?: string` - New description
  - Returns: `Category`

- `deleteCategory(id)` - Delete category
  - `id: number` - Category ID
  - Returns: `{ success: boolean }`

## Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set build command: `npm run build`
4. Set output directory: `client`
5. **Add environment variable**:
   - `NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com`
   - Replace `your-backend-url` with your actual Render backend URL

### Backend (Render)

1. Connect GitHub repository to Render
2. Set build command: `npm install`
3. Set start command: `npm start`
4. **Set root directory**: `server`
5. Add environment variables:
   - `DATABASE_URL=your-neon-connection-string`
   - `NODE_ENV=production`
   - `CORS_ORIGIN=https://your-frontend-url.vercel.app`
   - Replace `your-frontend-url` with your actual Vercel frontend URL

### Database (Neon)

1. Create production database on Neon
2. Run migrations: `npm run migrate`
3. Seed data: `npm run seed`

### Production Connection Setup

**Important**: In production, the frontend (Vercel) connects to the backend (Render) instead of using mock data.

**Frontend Environment Variables (Vercel)**:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

**Backend Environment Variables (Render)**:

```env
DATABASE_URL=your-neon-connection-string
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

**Connection Flow**:

1. Frontend (Vercel) → Backend (Render) → Database (Neon)
2. The frontend automatically detects production environment and connects to Render backend
3. Backend serves tRPC API at `/api/trpc` endpoint
4. CORS is configured to allow requests from your Vercel domain

## Trade-offs & Decisions

### 1. **Mock Data vs Real Database**

- **Decision**: Used mock data for rapid development and demonstration
- **Trade-off**: No persistent data storage, but faster setup and demo-ready
- **Rationale**: Allows immediate testing without database setup complexity

### 2. **Markdown vs Rich Text Editor**

- **Decision**: Implemented Markdown editor with live preview
- **Trade-off**: Less user-friendly than WYSIWYG, but more developer-friendly
- **Rationale**: Faster implementation, better version control, and more flexible content

### 3. **tRPC vs REST API**

- **Decision**: Used tRPC for end-to-end type safety
- **Trade-off**: Learning curve, but eliminates API documentation needs
- **Rationale**: Type safety reduces bugs and improves developer experience

### 4. **Drizzle ORM vs Prisma**

- **Decision**: Chose Drizzle ORM for lightweight, TypeScript-first approach
- **Trade-off**: Smaller ecosystem, but better performance and type safety
- **Rationale**: Better TypeScript integration and smaller bundle size

### 5. **Next.js App Router vs Pages Router**

- **Decision**: Used App Router for modern React patterns
- **Trade-off**: Newer API, but better performance and developer experience
- **Rationale**: Future-proof choice with better performance optimizations

### 6. **Tailwind CSS vs Styled Components**

- **Decision**: Used Tailwind CSS for utility-first styling
- **Trade-off**: Less component encapsulation, but faster development
- **Rationale**: Rapid prototyping and consistent design system

### 7. **Zustand vs Redux**

- **Decision**: Used Zustand for simple state management
- **Trade-off**: Less ecosystem, but simpler API and smaller bundle
- **Rationale**: Perfect for this project's state management needs

## License

MIT License - see [LICENSE](LICENSE) file for details.
