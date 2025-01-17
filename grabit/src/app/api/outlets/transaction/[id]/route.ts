import TransactionModel from "@/db/models/transaksiModel"

export async function PUT(request:Request, 
    {params}: {params: { id: string }}
) {
    const { id } = params
    const { products, status} = await request.json()
    try {
        const result =  await TransactionModel.updateTransaction(id, products, status)
        return new Response(
            JSON.stringify({ message: " Transaction update successfully"}),
                { status: 200}
        )
    } catch (error) {
        console.error("Error update transaction:", error)
        return new Response(
            JSON.stringify({ message: "Faild to update transcation", error}),
            {status: 500}
        )
    }
    return Response.json({ id })
}

export async function GET(
    request: Request,
    {params}: {params: { id: string }}
) {
    const { id } = params
    const transaction = await TransactionModel.getById(id)

    return Response.json(transaction)
}

export async function PATCH(  request: Request,
    {params}: {params: { id: string }}
) {
    const { id } = params
    const { status } = await request.json()
    await TransactionModel.updateStatus(id, status)

    return Response.json ({ message: " success "})
}