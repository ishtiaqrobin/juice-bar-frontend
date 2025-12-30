"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api-client";

interface FormData {
  name: string;
  email: string;
  phone: string;
}

export default function UserProfileComponent() {
  const { user, isLoading: loading, updateUser } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
  });

  // Update form data when user changes
  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
      if (user.image) {
        setProfileImage(user.image);
      }
    }
  }, [user]);

  // Show loading while auth is being checked
  if (loading) {
    return (
      <div className="border rounded-lg p-6 space-y-4">
        <Skeleton className="h-7 w-48" />
        <div className="space-y-6">
          {/* Profile Image Skeleton */}
          <div className="flex flex-col items-center space-y-4">
            <Skeleton className="w-32 h-32 rounded-full" />
            <Skeleton className="h-10 w-[195px]" />
          </div>

          {/* Form Fields Skeleton */}
          <div className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Button Skeleton */}
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  // Redirect if not logged in
  if (!user) {
    router.push("/login");
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Redirecting to login...</div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const response = await api.upload.profile(file);
        setProfileImage(response.data.data.url);
        toast.success("Profile image uploaded successfully!");
      } catch {
        toast.error("Failed to upload image. Please try again.");
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.users.updateProfile({
        ...formData,
        image: profileImage || undefined,
      });

      // Update user in AuthContext with fresh data from backend
      updateUser(response.data.data);

      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-6 space-y-4">
      <h2 className="text-xl font-semibold">Profile Information</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* Profile Image */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200">
              {profileImage || user?.image ? (
                <Image
                  src={profileImage || user?.image || ""}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-4xl text-gray-400">
                    {formData.name?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
              )}
            </div>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="max-w-[195px]"
            />
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Full Name
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required={!formData.phone}
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone Number
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              required={!formData.email}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-10 bg-primary text-white hover:cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update Profile"}
        </Button>
      </form>
    </div>
  );
}
