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
import HistoryExams from "@/components/history-exam";
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
  const [selectedMenu, setSelectedMenu] = useState<string>("History Exams");

  useEffect(() => {
    // if (!isLogin) {
    //   router.push("/login");
    //   return;
    // }

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
      case "History Exams":
        return <HistoryExams />;
      case "Statistics":
        return <Statisticspage />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="max-w-7xl mx-auto px-2 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="w-64 bg-white rounded-lg border border-slate-500">
          <div className="p-6">
            {/* User info */}
            <div className="flex flex-col items-center mb-4 border-b border-slate-500 pb-4">
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-2 shadow-inner">
                <span className="text-2xl font-bold text-white">
                  {user.name.charAt(0)}
                </span>
              </div>
              <h2 className="text-lg font-extrabold text-gray-800 text-center">
                Welcome, {user.name}
              </h2>
              <p className="text-sm text-gray-600 text-center">{user.email}</p>
              <p className="mt-1 text-xs text-gray-500 text-center">
                Manage your account information
              </p>
            </div>
            {/* Navigation items */}
            <nav>
              <ul>
                <li>
                  <button
                    onClick={() => setSelectedMenu("History Exams")}
                    className={`w-full text-left px-4 py-2 rounded-none  border-slate-500 ${
                      selectedMenu === "History Exams"
                        ? "bg-slate-200 text-gray-900"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    History Exams
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setSelectedMenu("Statistics")}
                    className={`w-full text-left px-4 py-2 rounded-none ${
                      selectedMenu === "Statistics"
                        ? "bg-slate-200 text-gray-900"
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

        {/* Main content */}
        <main className="flex-1">{renderContent()}</main>
      </div>
    </div>
  );
};

export default ProfilePage;
