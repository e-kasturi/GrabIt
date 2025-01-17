import TransactionModel from "@/db/models/transaksiModel"
import { productType } from "@/type"

export async function  GET(request:Request) {
    const outletId = request.headers.get("x-user-id") as string

    const today = new Date()
    const dayOfWeek = today.getDay()

    const startDate = new Date(today)
    startDate.setDate(today.getDate() - dayOfWeek + 1)
    startDate.setHours(0, 0, 0, 0)

    const endDate = new Date()
    endDate.setDate(today.getDate() - dayOfWeek + 7)
    endDate.setHours(23, 59, 59, 999)


    try {
        const transaction = await TransactionModel.reportWeekly(outletId, startDate, endDate)

        const totalPrice = transaction.reduce((sum, t) => {
            const productTotal = t.productDetail.reduce((productSum: number, product: productType) =>
            productSum + (product.price || 0), 0)
            return sum + productTotal
        }, 0)

        return Response.json({
            transaction,
            totalPrice,
            totalTransaction: transaction.length
        })
    } catch (error) {
      return Response.json({ error: "Failed to fetch report data"}, {status: 500})  
    }
}