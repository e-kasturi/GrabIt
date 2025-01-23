import ProductModel from "@/db/models/produkModel"

export async function GET(request: Request, { params}: { params: {slug: string}}) {
    const { slug} = params

    const produk = await ProductModel.findBySlug(slug)
    if (!produk) {
        return new Response(JSON.stringify({ message: "Produk not found"}), {
    status: 404
    })
    }

    return new Response(JSON.stringify(produk), { status: 200})
}

export async function DELETE(
request: Request,
{params}: { params: { slug: string}}
) {
    const { slug } = params

    const result = await ProductModel.deleteBySlug(slug)
    if( result.deletedCount === 0) {
        return new Response(JSON.stringify({ message: "Produk not found"}), {
            status: 404
        })
    }

    return new Response(
        JSON.stringify({
            message: "Produk delete successfully"}), {
                status: 200
            }
    )
}

    export async function PUT(
        request: Request,
        { params }: { params: { slug: string }}
    ) {
        const { slug } = params
        const newProduk = await request.json()

        try {
            const result = await ProductModel.updateBySlug(slug, newProduk)
            if(result.matchedCount === 0){
                return new Response(JSON.stringify({ message: "Produk not found"}), {
                    status: 404
                })
            }

            return new Response(
                JSON.stringify({
                    message: "produk updated successfully"
                }),
                { status: 200 }
            )
        } catch (error) {
            console.log("Error update produk:", error);
            return new Response(
                JSON.stringify({ 
                    message: "Failed to update produk", error: error
                }), 
                { status: 500}
            )
        }
    }
