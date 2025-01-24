import WishlistModel from "@/db/models/wishlistModel";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
  const userId = request.headers.get("x-user-id"); 
  const body = await request.json(); 

  if (!userId || !body.productId) {
    return NextResponse.json(
      { error: "userId or productId is missing" },
      { status: 400 }
    );
  }

  if (typeof body.productId !== "string" || !body.productId.trim()) {
    return NextResponse.json(
      { error: "Invalid productId" },
      { status: 400 }
    );
  }

  try {
    await WishlistModel.create({
      userId,
      productId: body.productId,  
      ...body,  
    });

    return NextResponse.json(
      { message: "Wishlist created successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create wishlist" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
    const userId = request.headers.get("x-user-id");  
  
    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }
  
    try {
      const wishlistItems = await WishlistModel.find({ userId });
  
      if (wishlistItems.length === 0) {
        return NextResponse.json(
          { message: "No items found in wishlist" },
          { status: 404 }
        );
      }
  
      return NextResponse.json(
        { wishlist: wishlistItems },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      return NextResponse.json(
        { error: "Failed to fetch wishlist" },
        { status: 500 }
      );
    }
  }
