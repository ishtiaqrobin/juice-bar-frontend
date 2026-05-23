"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { User } from "@/types";
import { updateUser } from "@/actions/admin.action";

const userSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be less than 50 characters"),
    phone: z
        .string()
        .regex(/^\d{11}$/, "Phone must be exactly 11 digits")
        .or(z.literal("")),
    role: z.enum(["ADMIN", "USER"]),
});

type UserFormValues = z.infer<typeof userSchema>;

interface UserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null;
    onSuccess?: () => void;
}

export default function UserDialog({
    open,
    onOpenChange,
    user,
    onSuccess,
}: UserDialogProps) {
    const [saving, setSaving] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: "",
            phone: "",
            role: "USER",
        },
    });

    const roleValue = watch("role");

    // Sync form when user changes or dialog opens
    useEffect(() => {
        if (open && user) {
            // Strip +88 prefix for display
            const phoneDisplay = user.phone
                ? user.phone.replace(/^\+88/, "")
                : "";
            reset({
                name: user.name || "",
                phone: phoneDisplay,
                role: (user.role as "ADMIN" | "USER") || "USER",
            });
        }
    }, [open, user, reset]);

    const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow digits, max 11
        const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 11);
        setValue("phone", digitsOnly, { shouldValidate: true });
    };

    const handleClose = () => {
        reset();
        onOpenChange(false);
    };

    const onSubmit = async (values: UserFormValues) => {
        if (!user?.id) return;
        setSaving(true);

        const toastId = toast.loading("Updating user...");
        try {
            // Add +88 prefix to phone if provided
            const phoneToSend =
                values.phone && !values.phone.startsWith("+88")
                    ? `+88${values.phone}`
                    : values.phone || undefined;

            const res = await updateUser(user.id, {
                name: values.name.trim(),
                role: values.role,
                ...(phoneToSend ? { phone: phoneToSend } : {}),
            });

            if (res.error) {
                toast.error(res.error.message, { id: toastId });
                return;
            }

            toast.success("User updated successfully", { id: toastId });
            onSuccess?.();
            handleClose();
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Update failed",
                { id: toastId }
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>
                        Update user information, then save changes.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name */}
                    <div className="space-y-1.5">
                        <label
                            htmlFor="user-name"
                            className="text-sm font-medium text-gray-800"
                        >
                            Name
                        </label>
                        <Input
                            id="user-name"
                            {...register("name")}
                            className="bg-white"
                            placeholder="Enter user name"
                        />
                        {errors.name && (
                            <p className="text-xs text-destructive">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Role */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-800">
                            Role
                        </label>
                        <Select
                            value={roleValue}
                            onValueChange={(v) =>
                                setValue("role", v as "ADMIN" | "USER", {
                                    shouldValidate: true,
                                })
                            }
                        >
                            <SelectTrigger className="bg-white w-full">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                                <SelectItem value="USER">User</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.role && (
                            <p className="text-xs text-destructive">
                                {errors.role.message}
                            </p>
                        )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                        <label
                            htmlFor="user-phone"
                            className="text-sm font-medium text-gray-800"
                        >
                            Phone
                        </label>
                        <div className="flex gap-2">
                            <div className="w-20">
                                <Input
                                    type="text"
                                    value="+88"
                                    readOnly
                                    className="bg-gray-50 text-center"
                                />
                            </div>
                            <Input
                                id="user-phone"
                                type="tel"
                                placeholder="01XXXXXXXXX"
                                className="flex-1 bg-white"
                                {...register("phone")}
                                onChange={handlePhoneInput}
                                maxLength={11}
                            />
                        </div>
                        {errors.phone && (
                            <p className="text-xs text-destructive">
                                {errors.phone.message}
                            </p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            className="hover:cursor-pointer"
                            onClick={handleClose}
                            disabled={saving}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="hover:cursor-pointer"
                            disabled={saving}
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}