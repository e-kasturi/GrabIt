
import ProductModel from "@/db/models/produkModel";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { outletId: string } }) {
  const { outletId } = params;
  console.log("outletId", outletId);
  
  try {
    const products = await ProductModel.findByOutletId( outletId );
    console.log(products);
    
    if (products.length === 0) {
      return new NextResponse(
        JSON.stringify({ message: "No product found for this outlet" }),
        { status: 404 }
      );
    }
    return new NextResponse(JSON.stringify(products), { status: 200 });
  } catch (error) {
    console.error("Error fetching services for outlet:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch services for this outlet" }),
      { status: 500 }
    );
  }
}
