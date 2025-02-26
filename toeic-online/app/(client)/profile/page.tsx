"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store/store";
import { setIsLogin } from "@/lib/store/data-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loading from "@/components/loading";
import Statisticspage from "../statistics/page"; // Adjust the import path accordingly
import HistoryExams from "../history/page";
import { MdHistoryEdu } from "react-icons/md";

interface UserProfile {
  name: string;
  email: string;
}

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const isLogin = useSelector((state: RootState) => state.data.isLogin);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMenu, setSelectedMenu] = useState<string>("Profile");

  useEffect(() => {
    if (!isLogin) {
      router.push("/login");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setUser(response.data);
      } catch (error: any) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [isLogin, router]);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>No user data available.</p>
      </div>
    );
  }

  // Function to render the main content based on selected menu
  const renderContent = () => {
    switch (selectedMenu) {
      case "Profile":
      case "Profile":
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
              <div className="flex justify-center">
                <div className="w-28 h-28 rounded-full bg-gray-800 flex items-center justify-center mb-6 shadow-inner">
                  <span className="text-4xl font-bold text-white">
                    {user.name.charAt(0)}
                  </span>
                </div>
              </div>
              <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-4">
                Welcome, {user.name}
              </h2>
              <p className="text-center text-gray-600 mb-8">
                Manage your account information below.
              </p>
              <div className="space-y-6">
                <div>
                  <Label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-800"
                  >
                    Name
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    value={user.name}
                    readOnly
                    className="mt-2 block w-full rounded-lg bg-gray-100 border border-gray-300 text-gray-800 focus:ring-gray-500 focus:border-gray-500"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-800"
                  >
                    Email
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    value={user.email}
                    readOnly
                    className="mt-2 block w-full rounded-lg bg-gray-100 border border-gray-300 text-gray-800 focus:ring-gray-500 focus:border-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case "History Exams":
        return <HistoryExams />;
      case "Statistics":
        return <Statisticspage />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {user.name.charAt(0)}
              </span>
            </div>
          </div>
          <nav>
            <ul>
              <li>
                <button
                  onClick={() => setSelectedMenu("Profile")}
                  className={`w-full text-left px-4 py-2 rounded-md mb-2 ${
                    selectedMenu === "Profile"
                      ? "bg-gray-200 text-gray-900"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Profile
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedMenu("History Exams")}
                  className={`w-full text-left px-4 py-2 rounded-md mb-2 ${
                    selectedMenu === "History Exams"
                      ? "bg-gray-200 text-gray-900"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  History Exams
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedMenu("Statistics")}
                  className={`w-full text-left px-4 py-2 rounded-md ${
                    selectedMenu === "Statistics"
                      ? "bg-gray-200 text-gray-900"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Statistics
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">{renderContent()}</main>
    </div>
  );
};

export default ProfilePage;
