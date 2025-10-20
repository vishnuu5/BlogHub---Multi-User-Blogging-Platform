"use client";

import { useState } from "react";
import MarkdownIt from "markdown-it";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const md = new MarkdownIt();

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your post in Markdown...",
}: MarkdownEditorProps) {
  const [preview, setPreview] = useState(false);

  return (
    <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
      <div className="flex gap-2 bg-gray-100 p-3 border-b-2 border-gray-300">
        <button
          type="button"
          onClick={() => setPreview(false)}
          className={`px-4 py-2 rounded font-semibold transition ${
            !preview
              ? "bg-blue-600 text-white border-2 border-blue-800"
              : "bg-white text-black border-2 border-gray-300 hover:bg-gray-50"
          }`}
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => setPreview(true)}
          className={`px-4 py-2 rounded font-semibold transition ${
            preview
              ? "bg-blue-600 text-white border-2 border-blue-800"
              : "bg-white text-black border-2 border-gray-300 hover:bg-gray-50"
          }`}
        >
          Preview
        </button>
      </div>

      {!preview ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-96 p-4 font-mono text-sm resize-none focus:outline-none text-black border-0"
        />
      ) : (
        <div className="p-4 min-h-96 prose prose-sm max-w-none text-black">
          <div
            dangerouslySetInnerHTML={{
              __html: md.render(value || "No content"),
            }}
          />
        </div>
      )}
    </div>
  );
}
