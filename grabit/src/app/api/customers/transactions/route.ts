import TransactionModel from "@/db/models/transaksiModel";
import { transactionType } from "@/type";

export async function POST(request: Request) {
  const userId = request.headers.get("x-user-id") as string;
  const body = await request.json();

  try {
    const result = await TransactionModel.create({
      userId,
      body: body as transactionType,
    });

    return Response.json({
      message: "Transaksi created successfully",
      transaction: result, 
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Response.json({ message: error.message }, { status: 400 });
    } else {
      return Response.json({ message: "Unknown error occurred" }, { status: 400 });
    }
  }
}



export async function GET(request: Request) {
  const customerId = request.headers.get("x-user-id") as string;

  const transactions = await TransactionModel.getByCustomerId(customerId);

  return Response.json(transactions);
}

