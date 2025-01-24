import ProductModel from "@/db/models/produkModel";

export async function GET (
    request: Request,
    { params }: { params: { slug: string } }
) {
    const { slug } = params
    const product = await ProductModel.findBySlug(slug)

    if (!product) {
        return new Response(
            JSON.stringify({ error: "Product not found" }),
            { status: 404 }
        )
    }

    return new Response(JSON.stringify(product), { status: 200 })
}

