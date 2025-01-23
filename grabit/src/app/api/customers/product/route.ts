
import ProductModel from "@/db/models/produkModel";

export async function GET(request: Request) {
    const outlet = await ProductModel.findAll();
    return Response.json(outlet);
}