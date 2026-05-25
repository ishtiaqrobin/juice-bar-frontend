"use client";

import React, { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useImageUpload } from "@/hooks/useImageUpload";
import { IMAGE_UPLOAD_CONFIG } from "@/constants/imageUpload";
import { userService } from "@/services";

interface FormData {
  name: string;
  email: string;
  phone: string;
}

export default function UserProfileComponent() {
  const { user, isLoading: loading, updateUser } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
  });

  // Use the reusable hook for image upload with compression
  const {
    file: imageFile,
    preview: imagePreview,
    isCompressing,
    handleFileChange,
    reset: resetImage,
  } = useImageUpload({
    showSuccessToast: true,
  });

  // Update form data when user changes
  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone?.startsWith("+88")
          ? user.phone.slice(3)
          : user.phone || "",
      });
    }
  }, [user]);

  // Show loading while auth is being checked
  if (loading) {
    return (
      <div className="border rounded-lg p-6 space-y-4">
        <Skeleton className="h-7 w-48" />
        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Skeleton className="w-32 h-32 rounded-full" />
            <Skeleton className="h-10 w-[195px]" />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // For phone number, only allow digits
    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "");
      if (digitsOnly.length <= 11) {
        setFormData((prev) => ({
          ...prev,
          [name]: digitsOnly,
        }));
      }
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Format phone with +88 prefix for backend
    const formattedPhone = formData.phone ? `+88${formData.phone}` : "";

    try {
      const response = await userService.updateProfile({
        ...formData,
        phone: formattedPhone,
        ...(imageFile && { imageFile }),
      });

      // Update user in AuthContext with fresh data from backend
      await updateUser(response.data);

      toast.success("Profile updated successfully!");
      resetImage();
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
              {imagePreview || user?.image ? (
                <Image
                  key={user?.id || "default"} // ID-based key for proper rendering
                  src={imagePreview || user?.image || ""}
                  alt={`Profile - ${user?.id || "user"}`}
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
              accept={IMAGE_UPLOAD_CONFIG.ACCEPT_TYPES}
              onChange={handleFileChange}
              disabled={isLoading || isCompressing}
              className="max-w-[195px]"
            />
            {!imagePreview && (
              <p className="text-xs text-gray-500">
                Max size: {IMAGE_UPLOAD_CONFIG.MAX_SIZE_MB} MB. Auto-compressed!
              </p>
            )}
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
              Email{" "}
              <span className="text-xs text-gray-500">(Not Editable)</span>
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              disabled
              onChange={handleInputChange}
              required={!formData.phone}
            />
          </div>

          {/* Phone Number with +88 prefix */}
          <div className="grid gap-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone Number
            </label>
            <div className="flex gap-2">
              <div className="w-20">
                <Input
                  id="countryCode"
                  type="text"
                  value="+88"
                  readOnly
                  className="text-center"
                />
              </div>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="01XXXXXXXXX"
                className="flex-1"
                value={formData.phone}
                onChange={handleInputChange}
                maxLength={11}
                minLength={11}
                pattern="[0-9]{11}"
                title="Please enter exactly 11 digits"
                required
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-10 bg-primary text-white hover:cursor-pointer"
          disabled={isLoading || isCompressing}
        >
          {isLoading
            ? "Updating..."
            : isCompressing
              ? "Compressing..."
              : "Update Profile"}
        </Button>
      </form>
    </div>
  );
}
