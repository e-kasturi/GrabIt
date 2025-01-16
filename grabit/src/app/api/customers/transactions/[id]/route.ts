import BalanceModel from "@/db/models/balanceModel"
import TransactionModel from "@/db/models/transaksiModel"

export async function GET(request:Request,
    { params }: {params: {id: string}}
) {
    const { id } = params

    const transaction = await TransactionModel.getById(id)

    return Response.json(transaction)
}

export async function PATCH(request:Request,
    { params }: {params: {id: string}}
) {
    const { id } = params
    const { status } = await request.json()

    if (status === "done"){
        await TransactionModel.updateStatus(id, status)

        let transaction = await TransactionModel.getById(id)
        let totalAmount = transaction[0].totalAmount || 0
        let outletId = transaction[0]?.outletId

        await BalanceModel.updateBalance(outletId, totalAmount)
    }

    return Response.json({ message: " success"})
}

