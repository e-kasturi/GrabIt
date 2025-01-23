import TransactionModel from "@/db/models/transaksiModel"
import { productType } from "@/type"

export async function GET(request:Request) {
    const outletId = request.headers.get("x-user-id") as string

    const date = new Date()

    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    try {
        const transaction = await TransactionModel.reportDaily(outletId, startOfDay)

        const totalPrice = transaction.reduce((sum, t) => {
            const productTotal = t.productDetail.reduce((productSum: number, product: productType) => productSum + (product.price || 0), 0)
            return sum + productTotal
        }, 0)

      return Response.json({
        transaction,
        totalTransaction: transaction.length,
        totalPrice
      })
    } catch (error) {
        return Response.json({
            error: "Failed to fetch report data"
        }, { status: 500 })
    }
}