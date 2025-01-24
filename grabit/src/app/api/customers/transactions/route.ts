import TransactionModel from "@/db/models/transaksiModel"


export async function POST(request: Request) {
    const userId = request.headers.get("x-user-id") as string; 
    const body = await request.json(); 
  

    if (!userId || !body.outletId) {
      return new Response(
        JSON.stringify({ error: "UserId or OutletId is missing" }),
        { status: 400 }
      );
    }
  
    await TransactionModel.create({
      userId,
      outletId: body.outletId,  
      ...body, 
    });
  
    return new Response(
      JSON.stringify({ message: "Transaction created successfully" }),
      { status: 200 }
    );
  }
  

export async function GET(request:Request) {
    const customerId = request.headers.get("x-user-id") as string

    const transaction = await TransactionModel.getByCustomerId(customerId)

    return Response.json(transaction)
}