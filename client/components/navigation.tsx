"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b-2 border-blue-600 sticky top-0 z-50">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          BlogHub
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 hover:bg-gray-100 rounded border-2 border-gray-300"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-black" />
          ) : (
            <Menu className="w-6 h-6 text-black" />
          )}
        </button>

        <div
          className={`${
            isOpen ? "block" : "hidden"
          } md:flex gap-6 absolute md:static top-16 left-0 right-0 bg-white md:bg-transparent border-b md:border-0 p-4 md:p-0`}
        >
          <Link
            href="/blog"
            className="block md:inline px-4 py-2 text-blue-600 font-semibold hover:text-blue-800 border-b-2 border-transparent hover:border-blue-600 transition"
          >
            Blog
          </Link>
          <Link
            href="/dashboard"
            className="block md:inline px-4 py-2 text-blue-600 font-semibold hover:text-blue-800 border-b-2 border-transparent hover:border-blue-600 transition"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/posts/new"
            className="block md:inline px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            New Post
          </Link>
        </div>
      </div>
    </nav>
  );
}
