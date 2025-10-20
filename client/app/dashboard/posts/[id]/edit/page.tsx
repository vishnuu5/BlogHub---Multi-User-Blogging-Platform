"use client";

import type React from "react";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import MarkdownEditor from "@/components/markdown-editor";

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const postId = Number.parseInt(resolvedParams.id);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [published, setPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: categoriesData } = trpc.categories.getAll.useQuery();
  const utils = trpc.useUtils();

  const { data: postData } = trpc.posts.getAll.useQuery({
    limit: 100,
    offset: 0,
  });

  useEffect(() => {
    if (postData?.posts && postData.posts.length > 0) {
      const post = postData.posts.find((p: any) => p.id === postId);
      if (post) {
        setTitle(post.title);
        setContent(post.content);
        setPublished(post.status === "published");
        setSelectedCategories(post.categories?.map((c: any) => c.id) || []);
        setIsLoading(false);
      } else {
        setError("Post not found");
        setIsLoading(false);
      }
    }
  }, [postData, postId]);

  const updatePost = trpc.posts.update.useMutation({
    onSuccess: () => {
      utils.posts.getAll.invalidate();
      router.push("/dashboard/posts");
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const deletePost = trpc.posts.delete.useMutation({
    onSuccess: () => {
      utils.posts.getAll.invalidate();
      router.push("/dashboard/posts");
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
      await updatePost.mutateAsync({
        id: postId,
        title: title.trim(),
        content: content.trim(),
        published,
        categoryIds: selectedCategories,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update post");
    }
  };

  const handleDelete = async () => {
    if (
      confirm(
        "Are you sure you want to delete this post? This cannot be undone."
      )
    ) {
      try {
        await deletePost.mutateAsync({ id: postId });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete post");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container py-12 text-center text-black">
        Loading post...
      </div>
    );
  }

  if (error && !postData) {
    return (
      <div className="container py-12 text-center">
        <p className="text-red-600 font-semibold mb-4">{error}</p>
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-black">Edit Post</h1>

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
            {categoriesData?.map((cat: any) => (
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

        <div className="flex gap-4 flex-wrap">
          <button
            type="submit"
            disabled={updatePost.isPending}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 border-2 border-blue-800"
          >
            {updatePost.isPending ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deletePost.isPending}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 border-2 border-red-800"
          >
            {deletePost.isPending ? "Deleting..." : "Delete Post"}
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
