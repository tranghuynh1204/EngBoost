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
        console.error("Failed to fetch profile:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          dispatch(setIsLogin(false));
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [isLogin, dispatch, router]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    dispatch(setIsLogin(false));
    router.push("/login");
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[rgb(250,240,230)] to-[rgb(185,180,199)] flex items-center justify-center p-6">
      <div className="bg-[rgb(250,240,230)] rounded-2xl shadow-lg p-8 w-full max-w-lg">
        <div className="flex justify-center">
          <div className="w-28 h-28 rounded-full bg-[rgb(92,84,112)] flex items-center justify-center mb-6 shadow-inner">
            <span className="text-4xl font-bold text-[rgb(250,240,230)]">
              {user.name[0]}
            </span>
          </div>
        </div>
        <h2 className="text-3xl font-extrabold text-center text-[rgb(53,47,68)] mb-4">
          Welcome, {user.name}
        </h2>
        <p className="text-center text-[rgb(92,84,112)] mb-8">
          Manage your account information below.
        </p>
        <div className="space-y-6">
          <div>
            <Label
              htmlFor="name"
              className="block text-sm font-medium text-[rgb(53,47,68)]"
            >
              Name
            </Label>
            <Input
              type="text"
              id="name"
              value={user.name}
              readOnly
              className="mt-2 block w-full rounded-lg bg-[rgb(250,240,230)] border border-[rgb(185,180,199)] text-[rgb(53,47,68)] focus:ring-[rgb(92,84,112)] focus:border-[rgb(92,84,112)]"
            />
          </div>
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-[rgb(53,47,68)]"
            >
              Email
            </Label>
            <Input
              type="email"
              id="email"
              value={user.email}
              readOnly
              className="mt-2 block w-full rounded-lg bg-[rgb(250,240,230)] border border-[rgb(185,180,199)] text-[rgb(53,47,68)] focus:ring-[rgb(92,84,112)] focus:border-[rgb(92,84,112)]"
            />
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleLogout}
            className="w-full bg-[rgb(53,47,68)] hover:bg-[rgb(92,84,112)] text-[rgb(250,240,230)] font-semibold py-3 px-6 rounded-lg shadow-md"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
