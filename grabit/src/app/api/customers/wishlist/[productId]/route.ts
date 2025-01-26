import WishlistModel from "@/db/models/wishlistModel";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb"; 

export async function DELETE(request: NextRequest, { params }: { params: { productId: string } }) {
  const userId = request.headers.get("x-user-id"); 


  if (!userId || !params.productId) {
    return NextResponse.json(
      { error: "userId or productId is missing" },
      { status: 400 }
    );
  }

  if (typeof params.productId !== "string" || !params.productId.trim()) {
    return NextResponse.json(
      { error: "Invalid productId" },
      { status: 400 }
    );
  }

  try {
    const userObjectId = new ObjectId(userId);
    const productObjectId = new ObjectId(params.productId); 

    const wishlistItem = await WishlistModel.findOne({
      userId: userObjectId,
      productId: productObjectId,
    });

    if (!wishlistItem) {
      return NextResponse.json(
        { error: "Product not found in wishlist" },
        { status: 404 }
      );
    }

    await WishlistModel.deleteOne({
      userId: userObjectId,
      productId: productObjectId,
    });

    return NextResponse.json(
      { message: "Product removed from wishlist" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing product from wishlist:", error); 
    return NextResponse.json(
      { error: "Failed to remove product from wishlist" },
      { status: 500 }
    );
  }
}
