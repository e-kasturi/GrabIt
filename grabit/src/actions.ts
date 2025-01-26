"use server";
import { cookies } from "next/headers";
import {transactionType} from "@/type"

export const handleLogout = async () => {
    cookies().delete("authorization");
  };
  

  export async function getTransactionById(id: string): Promise<transactionType[]> {
    const cookieStore = cookies();
    const cookieHeader = cookieStore.toString();
  
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/outlets/transaction/${id}`,
      {
        headers: {
          Cookie: cookieHeader,
        },
        next: {
          tags: ["transactions"],
        },
      }
    );
  
    if (!response.ok) {
      throw new Error(`Failed to fetch transaction with ID ${id}`);
    }
  
    const transaction: transactionType[] = await response.json();
    return transaction;
  }
  