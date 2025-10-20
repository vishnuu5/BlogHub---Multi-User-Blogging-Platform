"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import MarkdownEditor from "@/components/markdown-editor";

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [published, setPublished] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: categories } = trpc.categories.getAll.useQuery();
  const utils = trpc.useUtils();

  const createPost = trpc.posts.create.useMutation({
    onSuccess: () => {
      utils.posts.getAll.invalidate();
      router.push("/dashboard");
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }

    if (!content.trim()) {
      setError("Please enter content");
      return;
    }

    try {
      await createPost.mutateAsync({
        title: title.trim(),
        content: content.trim(),
        published,
        categoryIds: selectedCategories,
        userId: 1, // Default user ID for demo
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
    }
  };

  return (
    <div className="container py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-black">Create New Post</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border-2 border-red-300 text-red-800 rounded-lg">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 border-2 border-gray-300 rounded-lg p-6"
      >
        <div>
          <label className="block text-sm font-semibold mb-2 text-black">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-black">
            Content
          </label>
          <MarkdownEditor value={content} onChange={setContent} />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-black">
            Categories
          </label>
          <div className="space-y-2 border-2 border-gray-200 rounded-lg p-4">
            {categories?.map((cat: any) => (
              <label
                key={cat.id}
                className="flex items-center gap-2 text-black"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCategories([...selectedCategories, cat.id]);
                    } else {
                      setSelectedCategories(
                        selectedCategories.filter((id) => id !== cat.id)
                      );
                    }
                  }}
                  className="w-4 h-4 border-2 border-gray-300"
                />
                <span>{cat.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-black">
            Status
          </label>
          <select
            value={published ? "published" : "draft"}
            onChange={(e) => setPublished(e.target.value === "published")}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={createPost.isPending}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 border-2 border-blue-800"
          >
            {createPost.isPending ? "Creating..." : "Create Post"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border-2 border-gray-300 text-black font-semibold rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
