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
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/outlets/transactions/${id}`,
      {
        headers: {
          Cookie: cookieHeader,
        },
        next: {
          tags: ["transactions"],
        },
      }
    );
  
    console.log("Response status:", response.status);
  
    if (!response.ok) {
      throw new Error(`Response status ${response.status}`);
    }
  
    const transaction: transactionType[] = await response.json();
    console.log("Transaction details:", transaction);
    return transaction;
  }
  