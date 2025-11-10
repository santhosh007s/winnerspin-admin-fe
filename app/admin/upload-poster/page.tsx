"use client";

import { useState } from "react";
import { posterAPI } from "@/lib/api";
import Loader from "@/components/loader"; // ✅ your global loader

export default function PosterUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [audience, setAudience] = useState<"promoter" | "customer">("promoter");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) {
      setError("Please choose a file before uploading.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const res = await posterAPI.upload(file, audience);
      alert(`Poster uploaded successfully for ${audience}!`);
      console.log(res);
      setFile(null);
    } catch (err) {
      console.error(err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative w-full h-[80vh] flex flex-col items-center justify-center p-4 mt-15 lg:mt-0">
      {/* ✅ Global Loader */}
      <Loader show={uploading} />

      {/* Page Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Upload Posters - Winnerspin
        </h1>
        <p className="text-gray-600">
          This poster will be displayed in the promoter panel / customer panel
        </p>
      </div>

      {/* Upload Card */}
      <div className="max-w-md w-full p-6 bg-white shadow-md rounded-xl border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Poster Uploader
        </h2>

        {/* File Input */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">
            Choose Poster:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full border border-gray-300 rounded px-2 py-1 cursor-pointer"
          />
          {file && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: <span className="font-medium">{file.name}</span>
            </p>
          )}
          {error && !file && (
            <p className="mt-1 text-sm text-red-600 font-medium">{error}</p>
          )}
        </div>

        {/* Audience Select */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">
            Audience:
          </label>
          <select
            value={audience}
            onChange={(e) =>
              setAudience(e.target.value as "promoter" | "customer")
            }
            className="w-full border border-gray-300 rounded px-2 py-1"
          >
            <option value="promoter">Promoter</option>
            <option value="customer">Customer</option>
          </select>
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`w-full py-2 px-4 rounded text-white font-semibold transition-colors ${
            uploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-black/50"
          }`}
        >
          {uploading ? "Uploading..." : "Upload Poster"}
        </button>

        {error && file && (
          <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
        )}
      </div>
    </div>
  );
}
