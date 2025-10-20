import { initTRPC } from "@trpc/server";
import { mockApi } from "./mock-data";
import {
  createPostSchema,
  updatePostSchema,
  deletePostSchema,
  getPostSchema,
  getPostBySlugSchema,
  getPostsSchema,
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
  getCategorySchema,
  generateSlug,
} from "./validations";

const t = initTRPC.create();

const router = t.router;
const publicProcedure = t.procedure;

const postsRouter = router({
  getAll: publicProcedure
    .input(getPostsSchema)
    .query(async ({ input = {} }) => {
      try {
        await mockApi.refreshPostsFromStorage();

        const result = await mockApi.getPosts({
          published: input.published,
          categoryId: input.categoryId,
          limit: input.limit ?? 10,
          offset: input.offset ?? 0,
        });

        return {
          posts: result.posts,
          total: result.total,
          hasMore: (input.offset ?? 0) + (input.limit ?? 10) < result.total,
        };
      } catch (error) {
        console.error("tRPC getAll error:", error);
        throw new Error("Failed to fetch posts");
      }
    }),

  getById: publicProcedure.input(getPostSchema).query(async ({ input }) => {
    try {
      const post = await mockApi.getPost(input.id);
      if (!post) {
        throw new Error("Post not found");
      }
      return post;
    } catch (error) {
      throw new Error("Failed to fetch post");
    }
  }),

  getBySlug: publicProcedure
    .input(getPostBySlugSchema)
    .query(async ({ input }) => {
      try {
        await mockApi.refreshPostsFromStorage();

        const result = await mockApi.getPosts({
          published: true,
        });

        const post = result.posts.find((p) => p.slug === input.slug);
        if (!post) {
          throw new Error("Post not found");
        }
        return post;
      } catch (error) {
        throw new Error("Failed to fetch post");
      }
    }),

  create: publicProcedure
    .input(createPostSchema)
    .mutation(async ({ input }) => {
      try {
        const postData = {
          title: input.title.trim(),
          content: input.content.trim(),
          published: input.published,
          categoryIds: input.categoryIds,
        };
        const newPost = await mockApi.createPost(postData);
        return newPost;
      } catch (error) {
        throw new Error("Failed to create post");
      }
    }),

  update: publicProcedure
    .input(updatePostSchema)
    .mutation(async ({ input }) => {
      try {
        const updateData: any = {};
        if (input.title) updateData.title = input.title.trim();
        if (input.content) updateData.content = input.content.trim();
        if (input.published !== undefined)
          updateData.published = input.published;
        if (input.categoryIds) updateData.categoryIds = input.categoryIds;

        const updatedPost = await mockApi.updatePost(input.id, updateData);
        return updatedPost;
      } catch (error) {
        throw new Error("Failed to update post");
      }
    }),

  delete: publicProcedure
    .input(deletePostSchema)
    .mutation(async ({ input }) => {
      try {
        await mockApi.deletePost(input.id);
        return { success: true };
      } catch (error) {
        throw new Error("Failed to delete post");
      }
    }),

  publish: publicProcedure.input(getPostSchema).mutation(async ({ input }) => {
    try {
      const publishedPost = await mockApi.publishPost(input.id);
      return publishedPost;
    } catch (error) {
      throw new Error("Failed to publish post");
    }
  }),
});

// Categories router
const categoriesRouter = router({
  getAll: publicProcedure.query(async () => {
    try {
      const categories = await mockApi.getCategories();
      return categories;
    } catch (error) {
      throw new Error("Failed to fetch categories");
    }
  }),

  getById: publicProcedure.input(getCategorySchema).query(async ({ input }) => {
    try {
      const categories = await mockApi.getCategories();
      const category = categories.find((c) => c.id === input.id);
      if (!category) {
        throw new Error("Category not found");
      }
      return category;
    } catch (error) {
      throw new Error("Failed to fetch category");
    }
  }),

  create: publicProcedure
    .input(createCategorySchema)
    .mutation(async ({ input }) => {
      try {
        const categoryData = {
          name: input.name.trim(),
          description: input.description?.trim(),
          slug: generateSlug(input.name),
        };
        const newCategory = await mockApi.createCategory(categoryData);
        return newCategory;
      } catch (error) {
        throw new Error("Failed to create category");
      }
    }),

  update: publicProcedure
    .input(updateCategorySchema)
    .mutation(async ({ input }) => {
      try {
        const updateData: any = {};
        if (input.name) {
          updateData.name = input.name.trim();
          updateData.slug = generateSlug(input.name);
        }
        if (input.description !== undefined) {
          updateData.description = input.description?.trim();
        }

        const updatedCategory = await mockApi.updateCategory(
          input.id,
          updateData
        );
        return updatedCategory;
      } catch (error) {
        throw new Error("Failed to update category");
      }
    }),

  delete: publicProcedure
    .input(deleteCategorySchema)
    .mutation(async ({ input }) => {
      try {
        await mockApi.deleteCategory(input.id);
        return { success: true };
      } catch (error) {
        throw new Error("Failed to delete category");
      }
    }),
});

// Main app router
export const appRouter = router({
  posts: postsRouter,
  categories: categoriesRouter,
});

export type AppRouter = typeof appRouter;
