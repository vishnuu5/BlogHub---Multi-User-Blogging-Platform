"use client";

import Link from "next/link";
import { trpc } from "@/lib/trpc";
import type { MockPost } from "@/lib/mock-data";

export default function DashboardPage() {
  const { data: postsData, isLoading } = trpc.posts.getAll.useQuery({
    limit: 10,
    offset: 0,
  });

  const publishedCount =
    postsData?.posts.filter((p: MockPost) => p.status === "published").length ||
    0;
  const draftCount =
    postsData?.posts.filter((p: MockPost) => p.status === "draft").length || 0;

  if (isLoading) {
    return (
      <div className="container py-12 text-center text-black">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white border border-border rounded-lg p-6">
          <h3 className="text-black text-sm font-semibold mb-2">Total Posts</h3>
          <p className="text-3xl font-bold">{postsData?.total || 0}</p>
        </div>
        <div className="bg-white border border-border rounded-lg p-6">
          <h3 className="text-black text-sm font-semibold mb-2">Published</h3>
          <p className="text-3xl font-bold text-green-600">{publishedCount}</p>
        </div>
        <div className="bg-white border border-border rounded-lg p-6">
          <h3 className="text-black text-sm font-semibold mb-2">Drafts</h3>
          <p className="text-3xl font-bold text-yellow-600">{draftCount}</p>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <Link
          href="/dashboard/posts/new"
          className="px-6 py-3 border border-border text-foreground font-semibold rounded-lg hover:bg-muted"
        >
          New Post
        </Link>
        <Link
          href="/dashboard/categories"
          className="px-6 py-3 border border-border text-foreground font-semibold rounded-lg hover:bg-muted"
        >
          Manage Categories
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Posts</h2>
          <div className="space-y-4">
            {postsData?.posts && postsData.posts.length > 0 ? (
              postsData.posts.slice(0, 5).map((post: MockPost) => (
                <Link
                  key={post.id}
                  href={`/dashboard/posts/${post.id}/edit`}
                  className="block p-4 border border-border rounded-lg hover:bg-muted transition"
                >
                  <h3 className="font-semibold text-foreground">
                    {post.title}
                  </h3>
                  <p className="text-sm text-secondary">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded mt-2 inline-block ${
                      post.status === "published"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {post.status === "published" ? "Published" : "Draft"}
                  </span>
                </Link>
              ))
            ) : (
              <div className="p-4 border border-border rounded-lg text-center text-secondary">
                No posts yet.{" "}
                <Link
                  href="/dashboard/posts/new"
                  className="text-blue-600 hover:underline"
                >
                  Create your first post
                </Link>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
          <div className="space-y-2">
            <Link
              href="/blog"
              className="block p-4 border border-border rounded-lg hover:bg-muted"
            >
              View Public Blog
            </Link>
            <Link
              href="/dashboard/posts"
              className="block p-4 border border-border rounded-lg hover:bg-muted"
            >
              All Posts
            </Link>
            <Link
              href="/dashboard/categories"
              className="block p-4 border border-border rounded-lg hover:bg-muted"
            >
              Manage Categories
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
