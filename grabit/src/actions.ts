"use server";
import { cookies } from "next/headers";

export const handleLogout = async () => {
    cookies().delete("authorization");
  };
  