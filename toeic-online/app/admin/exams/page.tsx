"use client";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const UploadExamPage = () => {
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState<string>("");

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "audio" | "image" | "excel"
  ) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      if (type === "audio") setAudioFile(file);
      if (type === "image") setImageFile(file);
      if (type === "excel") setExcelFile(file);
    }
  };

  const handleUpload = async (file: File, type: "audio" | "image") => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Send file to backend for uploading to Cloudinary
      const response = await axios.post("/upload/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const url = response.data.secure_url; // URL returned from backend

      if (type === "audio") setUploadedAudioUrl(url);
      if (type === "image") setUploadedImageUrl(url);
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Exam uploaded with Excel, Image, and Audio files.");
    // You can submit exam data here (including content from textarea)
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Upload New Exam
        </h1>
        <form onSubmit={handleSubmit}>
          {/* Excel File Input */}
          <div className="mb-6">
            <Input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => handleFileChange(e, "excel")}
              className="block w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {excelFile && (
              <div className="mt-2 text-gray-600">
                Excel file selected:{" "}
                <span className="font-medium">{excelFile.name}</span>
              </div>
            )}
          </div>

          {/* Audio File Input */}
          <div className="mb-6">
            <Input
              type="file"
              accept="audio/*"
              onChange={(e) => handleFileChange(e, "audio")}
              className="block w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              type="button"
              onClick={() => audioFile && handleUpload(audioFile, "audio")}
              className="mt-3 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Upload Audio
            </Button>
            {uploadedAudioUrl && (
              <div className="mt-2 text-blue-600">
                Audio uploaded:{" "}
                <a
                  href={uploadedAudioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {uploadedAudioUrl}
                </a>
              </div>
            )}
          </div>

          {/* Image File Input */}
          <div className="mb-6">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "image")}
              className="block w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Button
              type="button"
              onClick={() => imageFile && handleUpload(imageFile, "image")}
              className="mt-3 w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Upload Image
            </Button>
            {uploadedImageUrl && (
              <div className="mt-2 text-green-600">
                Image uploaded:{" "}
                <a
                  href={uploadedImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {uploadedImageUrl}
                </a>
              </div>
            )}
          </div>

          {/* Exam Content */}
          <div className="mb-6">
            <textarea
              value={editorContent}
              onChange={(e) => setEditorContent(e.target.value)}
              placeholder="Enter exam content here..."
              rows={6}
              className="block w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Submit Exam
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UploadExamPage;
