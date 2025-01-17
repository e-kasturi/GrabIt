import CustomerModel from "@/db/models/customerModel"
import { error } from "console"

export async function GET(request:Request) {
    const id = request.headers.get("x-user-id") as string
    const customer = await CustomerModel.findById(id)
    return Response.json(customer)
}


export async function PUT(request:Request) {
    try {
        const id = request.headers.get("x-user-id") as string

        if (!id){
            return new Response(
                JSON.stringify({ error: " User ID is required in headers" }),
                {status: 400}
            )
        }

        const body = await request.json()

        const updateCustomer  = await CustomerModel.updateProfile(id, body)

        return new Response(JSON.stringify(updateCustomer), { status: 200})
    } catch (error: any) {
        console.error("Error updating profile:", error.message)
        return new Response(
            JSON.stringify({ error: error.message || "Internal server error"})
        ,{status: 500}
        )
    }
}