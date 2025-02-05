import { NextRequest, NextResponse } from "next/server";
import WishlistModel from "@/db/models/wishlistModel";
import { ObjectId } from "mongodb";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId || !params.productId) {
      return NextResponse.json(
        { error: "userId or wishlistId is missing" },
        { status: 400 }
      );
    }

    const wishlistObjectId = new ObjectId(params.productId); 

    const wishlistItem = await WishlistModel.findOne({
      _id: wishlistObjectId,
    });

    if (!wishlistItem) {
      return NextResponse.json(
        { error: "Wishlist item not found" },
        { status: 404 }
      );
    }

    await WishlistModel.deleteOne({ _id: wishlistObjectId });

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
