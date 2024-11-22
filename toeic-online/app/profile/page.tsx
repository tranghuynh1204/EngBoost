// app/profile/page.tsx

"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import useAppSelector from "@/hooks/useAppSelector";
import useAppDispatch from "@/hooks/useAppDispatch";
import { setLogout } from "@/lib/store/auth-slice";

interface UserProfile {
  name: string;
  email: string;
  // Add other user fields as necessary
}

const ProfilePage: React.FC = () => {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const hasFetched = useRef(false); // Prevent multiple fetches

  useEffect(() => {
    console.log("Redux Auth State:", { isLoggedIn, accessToken });

    if (!isLoggedIn || !accessToken) {
      router.push("/login");
      return;
    }
    if (hasFetched.current) return; // Already fetched
    hasFetched.current = true;

    if (!isLoggedIn || !accessToken) {
      router.push("/login");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        console.log("Access Token:", accessToken); // Debugging
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log("Profile response data:", response.data); // Debugging
        setUser(response.data);
      } catch (error: any) {
        console.error("Error fetching profile:", error); // Debugging
        toast({
          title: "Error",
          description:
            error.response?.data?.message || "Failed to fetch profile.",
          variant: "destructive",
        });
        // Only log out if the error is due to unauthorized access
        if (error.response && error.response.status === 401) {
          dispatch(setLogout());
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [isLoggedIn, accessToken, router, toast, dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        No user data.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>
        <div className="space-y-4">
          <div>
            <Label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </Label>
            <Input
              type="text"
              id="name"
              value={user.name}
              readOnly
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </Label>
            <Input
              type="email"
              id="email"
              value={user.email}
              readOnly
              className="mt-1 block w-full"
            />
          </div>
          {/* Add more fields as needed */}
          <Button onClick={() => router.push("/")}>Back to Home</Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
