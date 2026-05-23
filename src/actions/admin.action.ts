"use server";

import { revalidateTag } from "next/cache";
import { adminService } from "@/services";
import { UpdateUserData } from "@/types/admin.type";

export const getUsers = async () => {
  return await adminService.getUsers();
};

export const updateUser = async (id: string, userData: UpdateUserData) => {
  try {
    const res = await adminService.updateUser(id, userData);
    revalidateTag("users", "max");
    return { data: res.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message:
          error instanceof Error ? error.message : "Failed to update user",
      },
    };
  }
};

export const deleteUser = async (id: string) => {
  try {
    const res = await adminService.deleteUser(id);
    revalidateTag("users", "max");
    return { data: res.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message:
          error instanceof Error ? error.message : "Failed to delete user",
      },
    };
  }
};
