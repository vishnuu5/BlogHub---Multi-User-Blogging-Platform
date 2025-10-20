"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { mockApi } from "@/lib/mock-data";

export default function CategoriesPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<
    { id: number; name: string; slug: string; description?: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      setIsLoading(true);
      try {
        const data = await mockApi.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCategories();
  }, []);

  const refetch = async () => {
    try {
      const data = await mockApi.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error refetching categories:", error);
    }
  };

  const createCategory = {
    mutateAsync: async (data: any) => {
      const slug = data.name.toLowerCase().replace(/\s+/g, "-");
      await mockApi.createCategory({ ...data, slug });
    },
    isPending: false,
  };
  const updateCategory = {
    mutateAsync: async (data: any) => {
      await mockApi.updateCategory(data.id, data);
    },
  };
  const deleteCategory = {
    mutateAsync: async (id: number) => {
      await mockApi.deleteCategory(id);
    },
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCategory.mutateAsync({ name, description });
      setName("");
      setDescription("");
      await refetch();
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      setDeletingId(id);
      try {
        console.log("Deleting category with id:", id);
        await deleteCategory.mutateAsync(id);
        console.log("Category deleted successfully");
        await refetch();
        console.log("Categories refreshed");
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Failed to delete category. Please try again.");
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container py-12 text-center text-black">
        Loading categories...
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-2xl">
      <h1 className="text-4xl font-bold mb-8 text-black">Manage Categories</h1>

      <form
        onSubmit={handleCreate}
        className="bg-white border-2 border-gray-300 rounded-lg p-6 mb-8"
      >
        <h2 className="text-xl font-bold mb-4 text-black">
          Create New Category
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-black">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-black">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Category description"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              rows={3}
            />
          </div>
          <button
            type="submit"
            disabled={createCategory.isPending}
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 border-2 border-blue-800"
          >
            {createCategory.isPending ? "Creating..." : "Create Category"}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-black">Existing Categories</h2>
        {categories?.length > 0 ? (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white border-2 border-gray-300 rounded-lg p-4 flex justify-between items-start hover:border-blue-400"
            >
              <div>
                <h3 className="font-semibold text-black">{cat.name}</h3>
                {cat.description && (
                  <p className="text-sm text-gray-600">{cat.description}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">Slug: {cat.slug}</p>
              </div>
              <button
                onClick={() => handleDelete(cat.id)}
                disabled={deletingId === cat.id}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 border-2 border-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingId === cat.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-600 border-2 border-gray-300 rounded-lg">
            No categories found. Create your first category above.
          </div>
        )}
      </div>
    </div>
  );
}
