import TransactionModel from "@/db/models/transaksiModel" 

export async function GET(request: Request){
    const outletId = request.headers.get("x-user-id") as string
    const transactions = await TransactionModel.getByOutletId(outletId)
    return Response.json(transactions)
}