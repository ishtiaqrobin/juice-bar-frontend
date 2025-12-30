"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";

export default function DeleteAccount() {
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const router = useRouter();
    const { logout } = useAuth();

    const handleDelete = async () => {
        setIsLoading(true);

        try {
            await api.users.deleteAccount();

            toast.success("Account deleted successfully");

            // Logout and redirect to home
            logout();
            router.push("/");
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Failed to delete account. Please try again.";
            toast.error(errorMessage);
            setIsLoading(false);
        }
    };

    return (
        <div className="border border-red-200 rounded-lg p-6 space-y-4 bg-red-50">
            <h2 className="text-xl font-semibold text-red-700">Delete Account</h2>
            <p className="text-sm text-red-600">
                Once you delete your account, there is no going back. Please be certain.
            </p>

            {!showConfirm ? (
                <Button
                    variant="destructive"
                    onClick={() => setShowConfirm(true)}
                    className="w-full h-10 cursor-pointer"
                >
                    Delete My Account
                </Button>
            ) : (
                <div className="space-y-3">
                    <p className="text-sm font-medium text-red-700">
                        Are you absolutely sure? This action cannot be undone.
                    </p>
                    <div className="flex gap-3">
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="flex-1 h-10 cursor-pointer"
                        >
                            Yes, Delete My Account
                            {/* {isLoading ? "Deleting..." : "Yes, Delete My Account"} */}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setShowConfirm(false)}
                            disabled={isLoading}
                            className="flex-1 h-10 cursor-pointer"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
