import TransactionModel from "@/db/models/transaksiModel"
import { productType } from "@/type"

export async function GET(request:Request) {
    const outletId = request.headers.get("x-user-id") as string

    const today = new Date()

    const startDate = new Date( today.getFullYear(), 0, 1)
    startDate.setHours(0, 0, 0, 0)

    const endDate = new Date(today.getFullYear(), 11, 31)
    endDate.setHours(23, 59, 59, 999)

    try {
        const transaction = await TransactionModel.reportYearly(outletId, startDate, endDate)

        const totalPrice = transaction.reduce((sum, t) => {
            const productTotal = t.productDetail.reduce((productSum: number, product: productType) => 
                productSum + (product.price || 0), 0)
            return sum + productTotal
        }, 0)

        return Response.json({
            transaction,
            totalTransaction: transaction.length,
            totalPrice,
        })
    } catch (error) {
        return Response.json({ error: "Failed to fetch report data"}, { status: 500})
    }
}