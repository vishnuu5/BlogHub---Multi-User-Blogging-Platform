"use client"

import { useState } from "react"
import Link from "next/link"
import { trpc } from "@/lib/trpc"
import { Plus, Filter, Eye, Edit3, Trash2 } from "lucide-react"

export default function PostsPage() {
  const [filter, setFilter] = useState<"all" | boolean>("all")

  const { data: postsData, isLoading } = trpc.posts.getAll.useQuery({
    ...(filter !== "all" && { published: filter === true }),
    limit: 50,
    offset: 0,
  })

  const utils = trpc.useUtils()
  const deletePost = trpc.posts.delete.useMutation({
    onSuccess: () => {
      utils.posts.getAll.invalidate()
    },
    onError: (error) => {
      console.error("Error deleting post:", error)
    },
  })

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost.mutateAsync({ id })
      } catch (error) {
        console.error("Error deleting post:", error)
      }
    }
  }

  return (
    <div className="container py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-black">My Posts</h1>
        <Link
          href="/dashboard/posts/new"
          className="px-6 py-3 bg-blue-600 text-white font-semibold border-2 border-blue-800 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Post
        </Link>
      </div>

      <div className="flex gap-4 mb-8 flex-wrap">
        <div className="flex items-center gap-2 text-black font-semibold">
          <Filter className="w-5 h-5" />
          Filter:
        </div>
        {(["all", "published", "draft"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f === "all" ? "all" : f === "published")}
            className={`px-4 py-2 rounded-lg transition border-2 flex items-center gap-2 ${
              (f === "all" && filter === "all") ||
              (f === "published" && filter === true) ||
              (f === "draft" && filter === false)
                ? "bg-blue-600 text-white border-blue-800"
                : "bg-gray-100 text-black border-gray-300 hover:bg-blue-100 hover:border-blue-400"
            }`}
          >
            {f === "published" && <Eye className="w-4 h-4" />}
            {f === "draft" && <Edit3 className="w-4 h-4" />}
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-black">Loading posts...</div>
      ) : postsData?.posts && postsData.posts.length > 0 ? (
        <div className="overflow-x-auto border-2 border-gray-300 rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-100 border-b-2 border-gray-400">
              <tr>
                <th className="text-left p-4 text-black font-semibold">Title</th>
                <th className="text-left p-4 text-black font-semibold">Status</th>
                <th className="text-left p-4 text-black font-semibold">Created</th>
                <th className="text-left p-4 text-black font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {postsData.posts.map((post: any) => (
                <tr key={post.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-4 font-semibold text-black">{post.title}</td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-3 py-1 rounded-full border-2 ${
                        post.published
                          ? "bg-green-100 text-green-800 border-green-300"
                          : "bg-yellow-100 text-yellow-800 border-yellow-300"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600 text-sm">{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 flex gap-3">
                    <Link
                      href={`/dashboard/posts/${post.id}/edit`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-semibold border-b border-transparent hover:border-blue-600 flex items-center gap-1"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      disabled={deletePost.isPending}
                      className="text-red-600 hover:text-red-800 text-sm font-semibold border-b border-transparent hover:border-red-600 flex items-center gap-1 disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-600 border-2 border-gray-300 rounded-lg">
          No posts yet.{" "}
          <Link href="/dashboard/posts/new" className="text-blue-600 font-semibold hover:underline">
            Create one
          </Link>
        </div>
      )}
    </div>
  )
}
