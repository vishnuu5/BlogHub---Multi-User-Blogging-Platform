"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import BlogCard from "@/components/blog-card";
import type { MockCategory } from "@/lib/mock-data";

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<
    number | undefined
  >();
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);

  const { data: categoriesData } = trpc.categories.getAll.useQuery();
  const {
    data: postsData,
    isLoading,
    error,
  } = trpc.posts.getAll.useQuery({
    published: true,
    ...(selectedCategory !== undefined && { categoryId: selectedCategory }),
    limit,
    offset,
  });

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8 text-black">Blog Posts</h1>

      {/* Category Filter */}
      {categoriesData && categoriesData.length > 0 && (
        <div className="mb-8 border-2 border-gray-300 rounded-lg p-6">
          <h3 className="font-semibold mb-4 text-black">Filter by Category</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setSelectedCategory(undefined);
                setOffset(0);
              }}
              className={`px-4 py-2 rounded-full transition border-2 ${
                selectedCategory === undefined
                  ? "bg-blue-600 text-white border-blue-800"
                  : "bg-gray-100 text-black border-gray-300 hover:bg-blue-100 hover:border-blue-400"
              }`}
            >
              All
            </button>
            {categoriesData.map((cat: MockCategory) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setOffset(0);
                }}
                className={`px-4 py-2 rounded-full transition border-2 ${
                  selectedCategory === cat.id
                    ? "bg-blue-600 text-white border-blue-800"
                    : "bg-gray-100 text-black border-gray-300 hover:bg-blue-100 hover:border-blue-400"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Posts Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-black">Loading posts...</div>
      ) : postsData?.posts && postsData.posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {postsData.posts.map((post: any) => (
            <BlogCard key={post.id} {...post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-600 border-2 border-gray-300 rounded-lg">
          No posts found
        </div>
      )}

      {/* Pagination */}
      {postsData && postsData.total > 0 && (
        <div className="flex justify-center gap-4 border-2 border-gray-300 rounded-lg p-4">
          <button
            onClick={() => setOffset(Math.max(0, offset - limit))}
            disabled={offset === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 border-2 border-blue-800 hover:bg-blue-700 flex items-center gap-1"
          >
            <ChevronLeft size={18} /> Prev
          </button>
          <span className="py-2 text-black">
            Page {Math.floor(offset / limit) + 1} of{" "}
            {Math.ceil(postsData.total / limit)}
          </span>
          <button
            onClick={() => setOffset(offset + limit)}
            disabled={offset + limit >= postsData.total}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 border-2 border-blue-800 hover:bg-blue-700 flex items-center gap-1"
          >
            Next <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
