// API untuk mengambil detail produk
export async function GET(request: Request) {
    const { slug } = request.params;
  
    try {
      const product = await ProductModel.findById(slug); // Cari produk berdasarkan ID
      if (!product) {
        return new Response("Product not found", { status: 404 });
      }
  
      return new Response(JSON.stringify(product), { status: 200 });
    } catch (error) {
      return new Response("Error fetching product", { status: 500 });
    }
  }
  