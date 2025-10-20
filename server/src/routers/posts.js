import { router, publicProcedure } from "../trpc.js"
import { z } from "zod"
import { db } from "../db/client.js"
import { posts, postCategories, categories } from "../db/schema.js"
import { eq, inArray, desc } from "drizzle-orm"
import { generateSlug } from "../utils/slug.js"

const createPostSchema = z.object({
  title: z.string().min(1, "Title required").max(255),
  content: z.string().min(1, "Content required"),
  published: z.boolean().default(false),
  categoryIds: z.array(z.number()).optional(),
  userId: z.number().min(1, "User ID required"),
})

const updatePostSchema = z.object({
  id: z.number(),
  title: z.string().min(1).max(255).optional(),
  content: z.string().min(1).optional(),
  published: z.boolean().optional(),
  categoryIds: z.array(z.number()).optional(),
})

export const postsRouter = router({
  createPost: publicProcedure.input(createPostSchema).mutation(async ({ input }) => {
    try {
      const slug = generateSlug(input.title)

      const result = await db
        .insert(posts)
        .values({
          title: input.title,
          slug,
          content: input.content,
          published: input.published,
          userId: input.userId,
        })
        .returning()

      const post = result[0]

      if (input.categoryIds && input.categoryIds.length > 0) {
        await db.insert(postCategories).values(
          input.categoryIds.map((categoryId) => ({
            postId: post.id,
            categoryId,
          })),
        )
      }

      return post
    } catch (error) {
      throw new Error(`Failed to create post: ${error.message}`)
    }
  }),

  getPosts: publicProcedure
    .input(
      z
        .object({
          published: z.boolean().optional(),
          categoryId: z.number().optional(),
          limit: z.number().default(10),
          offset: z.number().default(0),
        })
        .optional(),
    )
    .query(async ({ input = {} }) => {
      try {
        let query = db.select().from(posts)

        if (input.published !== undefined) {
          query = query.where(eq(posts.published, input.published))
        }

        if (input.categoryId) {
          const postIds = await db
            .select({ postId: postCategories.postId })
            .from(postCategories)
            .where(eq(postCategories.categoryId, input.categoryId))

          if (postIds.length === 0) return { posts: [], total: 0 }
          query = query.where(
            inArray(
              posts.id,
              postIds.map((p) => p.postId),
            ),
          )
        }

        const allPosts = await query.orderBy(desc(posts.createdAt))
        const paginatedPosts = allPosts.slice(input.offset, input.offset + input.limit)

        const postsWithCategories = await Promise.all(
          paginatedPosts.map(async (post) => {
            const postCats = await db
              .select()
              .from(postCategories)
              .leftJoin(categories, eq(postCategories.categoryId, categories.id))
              .where(eq(postCategories.postId, post.id))

            return {
              ...post,
              categories: postCats.map((pc) => pc.categories).filter(Boolean),
            }
          }),
        )

        return {
          posts: postsWithCategories,
          total: allPosts.length,
        }
      } catch (error) {
        throw new Error(`Failed to fetch posts: ${error.message}`)
      }
    }),

  getPostBySlug: publicProcedure.input(z.string()).query(async ({ input }) => {
    try {
      const post = await db.select().from(posts).where(eq(posts.slug, input)).limit(1)

      if (!post.length) return null

      const postCats = await db
        .select()
        .from(postCategories)
        .leftJoin(categories, eq(postCategories.categoryId, categories.id))
        .where(eq(postCategories.postId, post[0].id))

      return {
        ...post[0],
        categories: postCats.map((pc) => pc.categories).filter(Boolean),
      }
    } catch (error) {
      throw new Error(`Failed to fetch post: ${error.message}`)
    }
  }),

  updatePost: publicProcedure.input(updatePostSchema).mutation(async ({ input }) => {
    try {
      const updateData = {}
      if (input.title) updateData.title = input.title
      if (input.content) updateData.content = input.content
      if (input.published !== undefined) updateData.published = input.published
      updateData.updatedAt = new Date()

      const result = await db.update(posts).set(updateData).where(eq(posts.id, input.id)).returning()

      if (input.categoryIds) {
        await db.delete(postCategories).where(eq(postCategories.postId, input.id))
        if (input.categoryIds.length > 0) {
          await db.insert(postCategories).values(
            input.categoryIds.map((categoryId) => ({
              postId: input.id,
              categoryId,
            })),
          )
        }
      }

      return result[0]
    } catch (error) {
      throw new Error(`Failed to update post: ${error.message}`)
    }
  }),

  deletePost: publicProcedure.input(z.number()).mutation(async ({ input }) => {
    try {
      await db.delete(posts).where(eq(posts.id, input))
      return { success: true }
    } catch (error) {
      throw new Error(`Failed to delete post: ${error.message}`)
    }
  }),

  publishPost: publicProcedure.input(z.number()).mutation(async ({ input }) => {
    try {
      const result = await db
        .update(posts)
        .set({ published: true, updatedAt: new Date() })
        .where(eq(posts.id, input))
        .returning()

      return result[0]
    } catch (error) {
      throw new Error(`Failed to publish post: ${error.message}`)
    }
  }),
})
