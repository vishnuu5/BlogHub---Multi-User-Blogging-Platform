"use client";

import Link from "next/link";
import { trpc } from "@/lib/trpc";
import {
  PenTool,
  Tag,
  BarChart3,
  BookOpen,
  Edit3,
  CheckCircle,
  Users,
  Zap,
} from "lucide-react";
import { useUIStore } from "@/lib/store";
import type { MockPost } from "@/lib/mock-data";
import { useEffect } from "react";

export default function Home() {
  const { showToast } = useUIStore();
  const { data: postsData, isLoading } = trpc.posts.getAll.useQuery({
    published: true,
    limit: 3,
    offset: 0,
  });

  useEffect(() => {
    if (!isLoading) {
      if (postsData?.posts && postsData.posts.length > 0) {
        showToast("Loaded latest posts", "success");
      } else {
        showToast("No posts available yet", "info");
      }
    }
  }, [isLoading, postsData, showToast]);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20 border-b-2 border-blue-800">
        <div className="container text-center text-white">
          <h1 className="text-5xl font-bold mb-4 text-white">
            Welcome to BlogHub
          </h1>
          <p className="text-xl mb-8 text-white">
            Share your thoughts, ideas, and stories with the world
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/blog"
              className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition border-2 border-white flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              Explore Blogs
            </Link>
            <Link
              href="/dashboard/posts/new"
              className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition flex items-center gap-2"
            >
              <Edit3 className="w-5 h-5" />
              Start Writing
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12 text-black">
            Why Choose BlogHub?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 border-2 border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
              <PenTool className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-2 text-black">
                Easy Writing
              </h3>
              <p className="text-gray-600">
                Create and edit your posts with our intuitive markdown editor
              </p>
            </div>
            <div className="text-center p-6 border-2 border-gray-300 rounded-lg hover:border-green-500 transition-colors">
              <Tag className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <h3 className="text-xl font-semibold mb-2 text-black">
                Categories
              </h3>
              <p className="text-gray-600">
                Organize your content with custom categories and tags
              </p>
            </div>
            <div className="text-center p-6 border-2 border-gray-300 rounded-lg hover:border-purple-500 transition-colors">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-purple-600" />
              <h3 className="text-xl font-semibold mb-2 text-black">
                Analytics
              </h3>
              <p className="text-gray-600">
                Track your content performance and reader engagement
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12 text-black">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 border-2 border-gray-200 rounded-lg">
              <CheckCircle className="w-8 h-8 mx-auto mb-3 text-green-600" />
              <h3 className="font-semibold text-black mb-2">Draft & Publish</h3>
              <p className="text-sm text-gray-600">
                Save drafts and publish when ready
              </p>
            </div>
            <div className="text-center p-4 border-2 border-gray-200 rounded-lg">
              <Users className="w-8 h-8 mx-auto mb-3 text-blue-600" />
              <h3 className="font-semibold text-black mb-2">Multi-User</h3>
              <p className="text-sm text-gray-600">
                Support for multiple authors
              </p>
            </div>
            <div className="text-center p-4 border-2 border-gray-200 rounded-lg">
              <Zap className="w-8 h-8 mx-auto mb-3 text-yellow-600" />
              <h3 className="font-semibold text-black mb-2">
                Fast & Responsive
              </h3>
              <p className="text-sm text-gray-600">
                Built with modern web technologies
              </p>
            </div>
            <div className="text-center p-4 border-2 border-gray-200 rounded-lg">
              <BookOpen className="w-8 h-8 mx-auto mb-3 text-purple-600" />
              <h3 className="font-semibold text-black mb-2">Rich Content</h3>
              <p className="text-sm text-gray-600">
                Markdown support for rich formatting
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12 text-black">
            Recent Posts
          </h2>
          {isLoading ? (
            <div className="text-center py-12 text-black">Loading posts...</div>
          ) : postsData?.posts && postsData.posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {postsData.posts.map((post: MockPost) => (
                <div
                  key={post.id}
                  className="bg-white border-2 border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors"
                >
                  <h3 className="text-xl font-semibold mb-2 text-black">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {post.content.substring(0, 100)}...
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-blue-600 hover:text-blue-800 font-semibold border-b border-transparent hover:border-blue-600"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-600 border-2 border-gray-300 rounded-lg">
              No posts available yet.
            </div>
          )}
          <div className="text-center mt-8">
            <Link
              href="/blog"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 border-2 border-blue-800"
            >
              View All Posts
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
