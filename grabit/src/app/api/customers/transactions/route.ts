import TransactionModel from "@/db/models/transaksiModel"


export async function POST(request: Request) {
    const userId = request.headers.get("x-user-id") as string; // Ambil userId dari header
    const body = await request.json(); // Ambil body dari request
  
    // Pastikan outletId juga ada di dalam body atau request
    if (!userId || !body.outletId) {
      return new Response(
        JSON.stringify({ error: "UserId or OutletId is missing" }),
        { status: 400 }
      );
    }
  
    // Menggabungkan userId dan outletId ke dalam body
    await TransactionModel.create({
      userId,
      outletId: body.outletId,  // Pastikan outletId ada di body
      ...body, // Tambahkan data lain dari body ke dalam create
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