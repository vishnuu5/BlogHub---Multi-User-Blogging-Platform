import { router } from "../trpc.js";
import { postsRouter } from "./posts.js";
import { categoriesRouter } from "./categories.js";

export const appRouter = router({
  posts: postsRouter,
  categories: categoriesRouter,
});
