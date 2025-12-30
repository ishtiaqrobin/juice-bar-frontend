"use client";

import React, { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { Eye, EyeOff } from "lucide-react";

export default function ChangePassword() {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validation
        if (formData.newPassword.length < 6) {
            toast.error("New password must be at least 6 characters long");
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            await api.auth.changePassword({
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword,
            });

            toast.success("Password changed successfully!");

            // Reset form
            setFormData({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Failed to change password. Please try again.";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold">Change Password</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Current Password */}
                <div className="space-y-2">
                    <label htmlFor="oldPassword" className="text-sm font-medium">
                        Current Password
                    </label>
                    <div
                        className="relative">
                        <Input
                            id="oldPassword"
                            name="oldPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            value={formData.oldPassword}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter current password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrentPassword((v) => !v)}
                            aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-800 hover:cursor-pointer"
                        >
                            {showCurrentPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                    </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                    <label htmlFor="newPassword" className="text-sm font-medium">
                        New Password
                    </label>
                    <div className="relative">
                        <Input
                            id="newPassword"
                            name="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter new password (min 6 characters)"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword((v) => !v)}
                            aria-label={showNewPassword ? "Hide password" : "Show password"}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-800 hover:cursor-pointer"
                        >
                            {showNewPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                    </div>
                </div>

                {/* Confirm New Password */}
                <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium">
                        Confirm New Password
                    </label>
                    <div className="relative">
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                            placeholder="Confirm new password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword((v) => !v)}
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-800 hover:cursor-pointer"
                        >
                            {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full h-10 bg-primary text-white hover:cursor-pointer"
                    disabled={isLoading}
                >
                    Change Password
                    {/* {isLoading ? "Changing Password..." : "Change Password"} */}
                </Button>
            </form>
        </div>
    );
}
