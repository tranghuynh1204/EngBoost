import { useRouter } from "next/navigation";
import React from "react";

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
      <h1 className="text-6xl font-bold mb-4 text-gray-800">404</h1>
      <p className="text-lg mb-6">
        Oops! The page you are looking for does not exist.
      </p>
      <button
        onClick={() => router.push("/")}
        className="bg-blue-400 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-500 transition-transform transform hover:scale-105"
      >
        Go Back Home
      </button>
    </div>
  );
};

export default NotFound;
