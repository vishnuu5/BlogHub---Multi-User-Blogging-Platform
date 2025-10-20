import Link from "next/link";
import { formatDate, truncate, calculateReadingTime } from "@/lib/utils";
import { Clock, Tag } from "lucide-react";

interface BlogCardProps {
  id: number;
  title: string;
  slug: string;
  content: string;
  status: string;
  createdAt: Date | string;
  categories?: Array<{ id: number; name: string; slug: string }>;
}

export default function BlogCard({
  id,
  title,
  slug,
  content,
  status,
  createdAt,
  categories = [],
}: BlogCardProps) {
  const readingTime = calculateReadingTime(content);

  return (
    <article className="bg-white border-2 border-gray-300 rounded-lg p-6 hover:shadow-lg transition-shadow hover:border-blue-500">
      <div className="flex items-start justify-between mb-3">
        <h2 className="text-xl font-bold text-black flex-1">
          <Link href={`/blog/${slug}`} className="hover:text-blue-600">
            {title}
          </Link>
        </h2>
        {status === "draft" && (
          <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded border border-yellow-300">
            Draft
          </span>
        )}
      </div>

      <p className="text-gray-600 text-sm mb-4 flex items-center">
        <Clock className="w-4 h-4 mr-1" />
        {formatDate(createdAt)} • {readingTime} min read
      </p>

      <p className="text-gray-800 mb-4">{truncate(content, 150)}</p>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/blog?category=${cat.slug}`}
              className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-blue-100 border border-gray-300 hover:border-blue-300 flex items-center"
            >
              <Tag className="w-3 h-3 mr-1" />
              {cat.name}
            </Link>
          ))}
        </div>
      )}

      <Link
        href={`/blog/${slug}`}
        className="text-blue-600 font-semibold hover:text-blue-800 border-b-2 border-transparent hover:border-blue-600"
      >
        Read More →
      </Link>
    </article>
  );
}
