import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  content: z.string().min(1, "Content is required"),
  published: z.boolean().default(false),
  categoryIds: z.array(z.number()).default([]),
  userId: z.number().min(1, "User ID required"),
});

export const updatePostSchema = z.object({
  id: z.number(),
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  content: z.string().min(1, "Content is required"),
  published: z.boolean().optional(),
  categoryIds: z.array(z.number()).optional(),
});

export const deletePostSchema = z.object({
  id: z.number(),
});

export const getPostSchema = z.object({
  id: z.number(),
});

export const getPostBySlugSchema = z.object({
  slug: z.string(),
});

export const getPostsSchema = z.object({
  published: z.boolean().optional(),
  categoryId: z.number().optional(),
  limit: z.number().optional().default(10),
  offset: z.number().optional().default(0),
});

// Category validation schemas
export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name too long"),
  description: z.string().optional(),
});

export const updateCategorySchema = z.object({
  id: z.number(),
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name too long")
    .optional(),
  description: z.string().optional(),
});

export const deleteCategorySchema = z.object({
  id: z.number(),
});

export const getCategorySchema = z.object({
  id: z.number(),
});

// Utility function to generate slug
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
