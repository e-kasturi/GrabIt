import { ObjectId } from "mongodb";
import WishlistModel from "@/db/models/wishlistModel";
export async function GET(
    request: Request,
    { params }: { params: { productId: string } }
) {
    const { productId } = params;
    console.log('Product ID:', productId); // Add this line for debugging

    if (!ObjectId.isValid(productId)) {
        return new Response(
            JSON.stringify({ error: "Invalid product ID" }),
            { status: 400 }
        );
    }

    const product = await WishlistModel.getProductById(productId);

    if (!product) {
        return new Response(
            JSON.stringify({ error: "Product not found" }),
            { status: 404 }
        );
    }

    return new Response(JSON.stringify(product), { status: 200 });
}
