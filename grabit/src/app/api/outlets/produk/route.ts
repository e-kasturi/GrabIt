import OutletModel from "@/db/models/outletModel"
import ProductModel from "@/db/models/produkModel"
import { productType } from "@/type"
import { ObjectId } from "mongodb"

export async function POST(request: Request) {
    const outletId = request.headers.get("x-user-id") as string

    const body = await request.json()
    const outlet = await OutletModel.collection().findOne({
        _id: new ObjectId(outletId)
    })

    if(!outlet) {
        return new Response(JSON.stringify({ message: "Invalid outlet ID"}), {
            status: 400
        })
    }

    const newProduk = {
        ...body,
        outletId: new ObjectId(outletId)
    }

    await ProductModel.create(newProduk)

    return Response.json({
        message: "Product created successfully",
        status: 201
    })
}

export async function GET(request: Request){
    const outletId = request.headers.get("x-user-id") as string
    const produk: productType[] = await ProductModel.findByOutletId(outletId)

    return Response.json(produk)
}