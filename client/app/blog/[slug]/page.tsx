"use client";

import { use } from "react";
import { formatDate, calculateReadingTime } from "@/lib/utils";
import MarkdownIt from "markdown-it";
import Link from "next/link";
import { mockApi, type MockPost } from "@/lib/mock-data";
import { useEffect, useState } from "react";

const md = new MarkdownIt();

export default function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const [post, setPost] = useState<MockPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      setIsLoading(true);
      try {
        const data = await mockApi.getPosts({ published: true });
        const foundPost = data.posts.find(
          (p: any) => p.slug === resolvedParams.slug
        );
        setPost(foundPost || null);
      } catch (error) {
        console.error("Error loading post:", error);
        setPost(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadPost();
  }, [resolvedParams.slug]);

  if (isLoading) {
    return (
      <div className="container py-12 text-center text-black">Loading...</div>
    );
  }

  if (!post) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4 text-black">Post not found</h1>
        <Link
          href="/blog"
          className="text-blue-600 hover:text-blue-800 border-b border-transparent hover:border-blue-600"
        >
          Back to Blog
        </Link>
      </div>
    );
  }

  const readingTime = post ? calculateReadingTime(post.content) : 0;

  return (
    <article className="container py-12 max-w-3xl">
      <Link
        href="/blog"
        className="text-blue-600 hover:text-blue-800 mb-6 inline-block border-b border-transparent hover:border-blue-600"
      >
        ← Back to Blog
      </Link>

      <header className="mb-8 border-2 border-gray-300 rounded-lg p-6">
        <h1 className="text-4xl font-bold mb-4 text-black">{post.title}</h1>
        <div className="flex items-center gap-4 text-gray-600 text-sm mb-4">
          <span>{formatDate(post.createdAt)}</span>
          <span>•</span>
          <span>{readingTime} min read</span>
        </div>

        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.categories.map((cat: { id: number; name: string; slug: string }) => (
              <Link
                key={cat.id}
                href={`/blog?category=${cat.slug}`}
                className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-blue-100 border border-gray-300 hover:border-blue-300"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      <div
        className="prose prose-lg max-w-none mb-8 border-2 border-gray-200 rounded-lg p-6"
        dangerouslySetInnerHTML={{ __html: md.render(post.content) }}
      />

      <div className="border-t-2 border-gray-300 pt-8">
        <Link
          href="/dashboard/posts"
          className="text-blue-600 hover:text-blue-800 border-b border-transparent hover:border-blue-600"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </article>
  );
}
