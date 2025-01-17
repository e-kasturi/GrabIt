import TransactionModel from "@/db/models/transaksiModel"
import { productType } from "@/type"

export async function GET(request:Request) {
    const outletId = request.headers.get("x-user-id") as string

    const today = new Date()

    const startDate = new Date(today.getFullYear(), today.getMonth(), 1)
    startDate.setHours(0, 0, 0, 0)

    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    endDate.setHours(23, 59, 59, 999)

    try {
        const transaction = await TransactionModel.reportMonthly(outletId, startDate, endDate)

        const totalPrice = transaction.reduce((sum, t) => {
            const productTotal = t.productDetail.reduce((productSum: number, product: productType) => 
            productSum + (product.price || 0), 0)
            return sum + productTotal
        }, 0)

        return Response.json({
            transaction,
            totalTransaction: transaction.length,
            totalPrice
        })
    } catch (error) {
        return Response.json({ error: "Failed to Fetch report data"})
    }
}