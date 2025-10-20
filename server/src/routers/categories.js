import { router, publicProcedure } from "../trpc.js";
import { z } from "zod";
import { db } from "../db/client.js";
import { categories } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { generateSlug } from "../utils/slug.js";

const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
});

const updateCategorySchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
});

export const categoriesRouter = router({
  createCategory: publicProcedure
    .input(createCategorySchema)
    .mutation(async ({ input }) => {
      const slug = generateSlug(input.name);

      const result = await db
        .insert(categories)
        .values({
          name: input.name,
          slug,
          description: input.description,
        })
        .returning();

      return result[0];
    }),

  getCategories: publicProcedure.query(async () => {
    return await db.select().from(categories);
  }),

  updateCategory: publicProcedure
    .input(updateCategorySchema)
    .mutation(async ({ input }) => {
      const updateData = {};
      if (input.name) {
        updateData.name = input.name;
        updateData.slug = generateSlug(input.name);
      }
      if (input.description !== undefined) {
        updateData.description = input.description;
      }

      const result = await db
        .update(categories)
        .set(updateData)
        .where(eq(categories.id, input.id))
        .returning();

      return result[0];
    }),

  deleteCategory: publicProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      await db.delete(categories).where(eq(categories.id, input));
      return { success: true };
    }),
});
