"use client";

import { useSession } from "next-auth/react";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface FormData {
  name: string;
  email: string;
  phone: string;
}

export default function ProfilePage() {
  const { data: session, update, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
  });

  // Update form data when session changes
  React.useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: (session.user as { phone?: string }).phone || "",
      });
      if (session.user.image) {
        setProfileImage(session.user.image);
      }
    }
  }, [session]);

  // Remove the automatic session refresh to prevent infinite loop

  console.log(session?.user, "User Data From Profile Page");
  console.log("Session status:", status);
  console.log("User ID from session:", session?.user?.id);
  console.log("User name from session:", session?.user?.name);
  console.log("User email from session:", session?.user?.email);
  console.log("User phone from session:", session?.user?.phone);
  console.log("User image from session:", session?.user?.image);
  console.log("User role from session:", session?.user?.role);

  // Show loading while session is being fetched
  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <div className="text-lg text-gray-600">Loading your profile...</div>
        </div>
      </div>
    );
  }

  // Redirect if not logged in
  if (status === "unauthenticated" || !session) {
    router.push("/login");
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
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
      // Create FormData and append file
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setProfileImage(data.url);
          setMessage("Profile image uploaded successfully!");
        } else {
          setMessage("Failed to upload image. Please try again.");
        }
      } catch {
        setMessage("Error uploading image. Please try again.");
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          profileImage,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();

        // Update form data with the response first
        setFormData({
          name: updatedUser.name || "",
          email: updatedUser.email || "",
          phone: updatedUser.phone || "",
        });
        if (updatedUser.image) {
          setProfileImage(updatedUser.image);
        }

        // Force session refresh by calling update with new data
        await update({
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          image: updatedUser.image,
        });

        setMessage("Profile updated successfully!");

        // No need to reload the page, session will be updated automatically
      } else {
        setMessage("Failed to update profile. Please try again.");
      }
    } catch {
      setMessage("Error updating profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // const handleLogout = async () => {
  //   await signOut({ callbackUrl: "/login" });
  // };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Profile</h1>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div> */}

      <form onSubmit={handleSubmit} className="space-y-6">
        {message && (
          <div
            className={`p-4 rounded ${
              message.includes("success")
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <div className="space-y-4">
          {/* Profile Image */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200">
              {profileImage || session?.user?.image ? (
                <Image
                  src={profileImage || session?.user?.image || ""}
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
              className="max-w-[250px]"
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
          className="w-full h-10 bg-primary text-white"
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update Profile"}
        </Button>
      </form>
    </div>
  );
}
