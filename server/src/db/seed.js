import { db, closePool } from "./client.js";
import { posts, categories, postCategories, users } from "./schema.js";

async function seed() {
  try {
    console.log("Seeding database...");
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);

    // Clear existing data (only in development)
    if (process.env.NODE_ENV !== "production") {
      console.log("Clearing existing data...");
      await db.delete(postCategories);
      await db.delete(posts);
      await db.delete(categories);
      await db.delete(users);
    } else {
      console.log("⚠️  Skipping data clear in production");
    }

    // Create a default user
    const userResults = await db
      .insert(users)
      .values([
        {
          name: "Admin User",
          email: "admin@example.com",
        },
      ])
      .returning();

    // Seed categories
    const categoryResults = await db
      .insert(categories)
      .values([
        {
          name: "Technology",
          slug: "technology",
          description: "Latest tech trends and updates",
        },
        {
          name: "Web Development",
          slug: "web-development",
          description: "Web development tutorials and tips",
        },
        {
          name: "JavaScript",
          slug: "javascript",
          description: "JavaScript programming guides",
        },
        {
          name: "React",
          slug: "react",
          description: "React framework tutorials",
        },
        {
          name: "Database",
          slug: "database",
          description: "Database design and optimization",
        },
      ])
      .returning();

    // Seed posts
    const postResults = await db
      .insert(posts)
      .values([
        {
          title: "Getting Started with Next.js 15",
          slug: "getting-started-nextjs-15",
          content: `# Getting Started with Next.js 15

Next.js 15 brings exciting new features and improvements to the React framework.

## Key Features
- App Router improvements
- Enhanced performance
- Better TypeScript support
- Improved developer experience

## Installation

\`\`\`bash
npx create-next-app@latest my-app
\`\`\`

## First Steps

1. Create your first page
2. Add styling with Tailwind CSS
3. Deploy to Vercel

Next.js makes it easy to build modern web applications with React.`,
          status: "published",
          userId: userResults[0].id,
        },
        {
          title: "Understanding React Hooks",
          slug: "understanding-react-hooks",
          content: `# Understanding React Hooks

React Hooks allow you to use state and other React features without writing a class component.

## Common Hooks

### useState
Manage component state

### useEffect
Handle side effects

### useContext
Access context values

### useReducer
Complex state management

Hooks make React code more reusable and easier to understand.`,
          status: "published",
          userId: userResults[0].id,
        },
        {
          title: "PostgreSQL Best Practices",
          slug: "postgresql-best-practices",
          content: `# PostgreSQL Best Practices

Learn how to optimize your PostgreSQL databases for better performance.

## Indexing
Create indexes on frequently queried columns

## Query Optimization
Use EXPLAIN to analyze queries

## Connection Pooling
Manage database connections efficiently

## Backup Strategy
Regular backups are essential

Follow these practices to maintain a healthy database.`,
          status: "published",
          userId: userResults[0].id,
        },
        {
          title: "Building Type-Safe APIs with tRPC",
          slug: "building-type-safe-apis-trpc",
          content: `# Building Type-Safe APIs with tRPC

tRPC enables you to build end-to-end type-safe APIs without code generation.

## Benefits
- Full type safety
- Automatic API documentation
- Reduced boilerplate
- Better developer experience

## Getting Started

Install tRPC and set up your first router.

tRPC is perfect for full-stack TypeScript applications.`,
          status: "published",
          userId: userResults[0].id,
        },
        {
          title: "Tailwind CSS Tips and Tricks",
          slug: "tailwind-css-tips-tricks",
          content: `# Tailwind CSS Tips and Tricks

Master Tailwind CSS with these helpful tips and tricks.

## Responsive Design
Use responsive prefixes for mobile-first design

## Custom Configuration
Extend Tailwind with custom colors and utilities

## Performance
Optimize your CSS bundle size

## Best Practices
Follow Tailwind conventions for consistency

Tailwind CSS makes styling modern web applications fast and efficient.`,
          status: "draft",
          userId: userResults[0].id,
        },
      ])
      .returning();

    // Seed post-category relationships
    await db.insert(postCategories).values([
      { postId: postResults[0].id, categoryId: categoryResults[0].id }, // Next.js -> Technology
      { postId: postResults[0].id, categoryId: categoryResults[1].id }, // Next.js -> Web Development
      { postId: postResults[1].id, categoryId: categoryResults[3].id }, // React Hooks -> React
      { postId: postResults[1].id, categoryId: categoryResults[2].id }, // React Hooks -> JavaScript
      { postId: postResults[2].id, categoryId: categoryResults[4].id }, // PostgreSQL -> Database
      { postId: postResults[3].id, categoryId: categoryResults[0].id }, // tRPC -> Technology
      { postId: postResults[3].id, categoryId: categoryResults[1].id }, // tRPC -> Web Development
      { postId: postResults[4].id, categoryId: categoryResults[1].id }, // Tailwind -> Web Development
    ]);

    console.log("Database seeded successfully");
    console.log(`Created ${userResults.length} users`);
    console.log(`Created ${postResults.length} posts`);
    console.log(`Created ${categoryResults.length} categories`);
    await closePool();
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    await closePool();
    process.exit(1);
  }
}

seed();
