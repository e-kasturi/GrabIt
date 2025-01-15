import OutletModel from "@/db/models/outletModel";

export async function GET (request: Request) {
    const id = request.headers.get("x-user-id") as string
    const outlet = await OutletModel.findById(id)

    return Response.json(outlet)
}