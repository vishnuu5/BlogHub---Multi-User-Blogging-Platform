export interface MockPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  status: "draft" | "published";
  published?: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  userId: number;
  categories?: { id: number; name: string; slug: string }[];
}

export interface MockCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

// Helper functions for localStorage persistence
const getStoredPosts = (): MockPost[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("bloghub-posts");
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      return parsed.map((post: any) => ({
        ...post,
        createdAt: new Date(post.createdAt),
        updatedAt: new Date(post.updatedAt),
      }));
    }
  } catch (error) {
    console.error("Error loading posts from localStorage:", error);
  }
  return [];
};

const setStoredPosts = (posts: MockPost[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("bloghub-posts", JSON.stringify(posts));
  } catch (error) {
    console.error("Error saving posts to localStorage:", error);
  }
};

const getStoredCategories = (): MockCategory[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("bloghub-categories");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading categories from localStorage:", error);
  }
  return [];
};

const setStoredCategories = (categories: MockCategory[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("bloghub-categories", JSON.stringify(categories));
  } catch (error) {
    console.error("Error saving categories to localStorage:", error);
  }
};

const getStoredNextPostId = (): number => {
  if (typeof window === "undefined") return 6;
  try {
    const stored = localStorage.getItem("bloghub-next-post-id");
    return stored ? Number.parseInt(stored, 10) : 6;
  } catch (error) {
    console.error("Error loading next post ID from localStorage:", error);
    return 6;
  }
};

const setStoredNextPostId = (id: number) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("bloghub-next-post-id", id.toString());
  } catch (error) {
    console.error("Error saving next post ID to localStorage:", error);
  }
};

// Initial mock data
const initialPosts: MockPost[] = [
  {
    id: 1,
    title: "Getting Started with Next.js",
    slug: "getting-started-with-nextjs",
    content:
      "# Getting Started with Next.js\n\nThis is a comprehensive guide to Next.js...",
    status: "published",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    userId: 1,
    categories: [{ id: 1, name: "Technology", slug: "technology" }],
  },
  {
    id: 2,
    title: "Understanding React Hooks",
    slug: "understanding-react-hooks",
    content:
      "# Understanding React Hooks\n\nReact Hooks revolutionized how we write components...",
    status: "draft",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
    userId: 1,
    categories: [{ id: 1, name: "Technology", slug: "technology" }],
  },
  {
    id: 3,
    title: "PostgreSQL Best Practices",
    slug: "postgresql-best-practices",
    content:
      "# PostgreSQL Best Practices\n\nDatabase design and optimization tips...",
    status: "published",
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-01-25"),
    userId: 1,
    categories: [{ id: 2, name: "Web Development", slug: "web-development" }],
  },
  {
    id: 4,
    title: "Building Type-Safe APIs with tRPC",
    slug: "building-type-safe-apis-with-trpc",
    content:
      "# Building Type-Safe APIs with tRPC\n\nEnd-to-end type safety for your APIs...",
    status: "draft",
    createdAt: new Date("2024-01-30"),
    updatedAt: new Date("2024-01-30"),
    userId: 1,
    categories: [{ id: 2, name: "Web Development", slug: "web-development" }],
  },
  {
    id: 5,
    title: "Tailwind CSS Tips and Tricks",
    slug: "tailwind-css-tips-and-tricks",
    content:
      "# Tailwind CSS Tips and Tricks\n\nMaster the utility-first CSS framework...",
    status: "published",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
    userId: 1,
    categories: [{ id: 2, name: "Web Development", slug: "web-development" }],
  },
];

const initialCategories: MockCategory[] = [
  {
    id: 1,
    name: "Technology",
    slug: "technology",
    description: "Tech-related posts",
  },
  {
    id: 2,
    name: "Web Development",
    slug: "web-development",
    description: "Web development topics",
  },
  {
    id: 3,
    name: "Design",
    slug: "design",
    description: "UI/UX design content",
  },
];

let mockPosts: MockPost[] = [...initialPosts];
let mockCategories: MockCategory[] = getStoredCategories();
let nextPostId = getStoredNextPostId();

if (typeof window !== "undefined") {
  const storedPosts = getStoredPosts();
  if (storedPosts && storedPosts.length > 0) {
    mockPosts = storedPosts;
    const maxId = Math.max(...mockPosts.map((post) => post.id));
    nextPostId = Math.max(maxId + 1, nextPostId);
  } else {
    setStoredPosts(mockPosts);
  }

  setStoredNextPostId(nextPostId);
}

if (mockCategories.length === 0) {
  mockCategories = initialCategories;
  setStoredCategories(mockCategories);
}

export const mockApi = {
  refreshPostsFromStorage: () => {
    if (typeof window !== "undefined") {
      const storedPosts = getStoredPosts();
      if (storedPosts && storedPosts.length > 0) {
        mockPosts = storedPosts;
        const maxId = Math.max(...mockPosts.map((post) => post.id));
        nextPostId = Math.max(maxId + 1, nextPostId);
        setStoredNextPostId(nextPostId);
      }
    }
    return Promise.resolve(true);
  },

  getPosts: ({
    published,
    categoryId,
    limit = 10,
    offset = 0,
  }: {
    published?: boolean;
    categoryId?: number;
    limit?: number;
    offset?: number;
  } = {}) => {
    if (typeof window !== "undefined") {
      const storedPosts = getStoredPosts();
      if (storedPosts.length > 0) {
        mockPosts = storedPosts;
      }
    }

    let filteredPosts = [...mockPosts];
    if (published !== undefined) {
      filteredPosts = filteredPosts.filter((post) =>
        published ? post.status === "published" : post.status === "draft"
      );
    }

    if (categoryId) {
      filteredPosts = filteredPosts.filter((post) =>
        post.categories?.some((cat) => cat.id === categoryId)
      );
    }

    filteredPosts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const paginatedPosts = filteredPosts.slice(offset, offset + limit);

    return Promise.resolve({
      posts: paginatedPosts,
      total: filteredPosts.length,
    });
  },

  getPost: (id: number) => {
    const post = mockPosts.find((p) => p.id === id);
    return Promise.resolve(post || null);
  },

  createPost: (data: {
    title: string;
    content: string;
    published: boolean;
    categoryIds: number[];
  }) => {
    const slug = data.title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    const newPost: MockPost = {
      id: nextPostId++,
      title: data.title,
      slug: slug,
      content: data.content,
      status: data.published ? "published" : "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 1,
      categories: data.categoryIds
        .map((id) => {
          const category = mockCategories.find((c) => c.id === id);
          return category
            ? { id: category.id, name: category.name, slug: category.slug }
            : null;
        })
        .filter(Boolean) as { id: number; name: string; slug: string }[],
    };

    if (typeof window !== "undefined") {
      setStoredPosts([...mockPosts, newPost]);
      setStoredNextPostId(nextPostId);
    }

    mockPosts.push(newPost);
    return Promise.resolve(newPost);
  },

  updatePost: (
    id: number,
    data: {
      title?: string;
      content?: string;
      published?: boolean;
      categoryIds?: number[];
    }
  ) => {
    const postIndex = mockPosts.findIndex((p) => p.id === id);
    if (postIndex === -1) {
      throw new Error("Post not found");
    }

    const updatedPost: MockPost = {
      ...mockPosts[postIndex],
      ...(data.title && { title: data.title }),
      ...(data.content && { content: data.content }),
      ...(data.published !== undefined && {
        status: data.published ? "published" : "draft",
      }),
      updatedAt: new Date(),
      ...(data.categoryIds && {
        categories: data.categoryIds
          .map((id) => {
            const category = mockCategories.find((c) => c.id === id);
            return category
              ? { id: category.id, name: category.name, slug: category.slug }
              : null;
          })
          .filter(Boolean) as { id: number; name: string; slug: string }[],
      }),
    };

    mockPosts[postIndex] = updatedPost;
    setStoredPosts(mockPosts);
    return Promise.resolve(updatedPost);
  },

  deletePost: (id: number) => {
    const postIndex = mockPosts.findIndex((p) => p.id === id);
    if (postIndex === -1) {
      throw new Error("Post not found");
    }
    mockPosts.splice(postIndex, 1);
    setStoredPosts(mockPosts);
    return Promise.resolve();
  },

  publishPost: (id: number) => {
    const postIndex = mockPosts.findIndex((p) => p.id === id);
    if (postIndex === -1) {
      throw new Error("Post not found");
    }
    mockPosts[postIndex].status = "published";
    mockPosts[postIndex].updatedAt = new Date();
    setStoredPosts(mockPosts);
    return Promise.resolve(mockPosts[postIndex]);
  },
  getCategories: () => {
    return Promise.resolve(mockCategories);
  },

  createCategory: (data: {
    name: string;
    slug: string;
    description?: string;
  }) => {
    const newCategory: MockCategory = {
      id: mockCategories.length + 1,
      name: data.name,
      slug: data.slug,
      description: data.description,
    };
    mockCategories.push(newCategory);
    setStoredCategories(mockCategories);
    return Promise.resolve(newCategory);
  },

  updateCategory: (
    id: number,
    data: { name?: string; slug?: string; description?: string }
  ) => {
    const categoryIndex = mockCategories.findIndex((c) => c.id === id);
    if (categoryIndex === -1) {
      throw new Error("Category not found");
    }
    mockCategories[categoryIndex] = {
      ...mockCategories[categoryIndex],
      ...(data.name && { name: data.name }),
      ...(data.slug && { slug: data.slug }),
      ...(data.description !== undefined && { description: data.description }),
    };
    setStoredCategories(mockCategories);
    return Promise.resolve(mockCategories[categoryIndex]);
  },

  deleteCategory: (id: number) => {
    const categoryIndex = mockCategories.findIndex((c) => c.id === id);
    if (categoryIndex === -1) {
      throw new Error("Category not found");
    }
    mockCategories.splice(categoryIndex, 1);
    setStoredCategories(mockCategories);
    return Promise.resolve();
  },

  // Utility function to reset all data (useful for testing)
  resetData: () => {
    mockPosts = initialPosts;
    mockCategories = initialCategories;
    nextPostId = 6;
    setStoredPosts(mockPosts);
    setStoredCategories(mockCategories);
    setStoredNextPostId(nextPostId);
    return Promise.resolve();
  },
};
