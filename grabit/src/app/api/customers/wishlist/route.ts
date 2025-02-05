import WishlistModel from "@/db/models/wishlistModel";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";  

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


  let objectUserId;
  try {
    objectUserId = new ObjectId(userId);  
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid userId format" },
      { status: 400 }
    );
  }

  try {
    const existingWishlist = await WishlistModel.findOne({
      userId: objectUserId,
      productId: body.productId,
    });

    if (existingWishlist) {
      return NextResponse.json(
        { error: "Product is already in the wishlist" },
        { status: 400 }
      );
    }

    await WishlistModel.create({
      userId: objectUserId,
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

  let objectUserId: ObjectId;

  try {
    objectUserId = new ObjectId(userId); 
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid userId format" },
      { status: 400 }
    );
  }

  try {
    const wishlistItems = await WishlistModel.findByUserId(objectUserId);

    if (wishlistItems.length === 0) {
      return NextResponse.json(
        { message: "No items found in wishlist" },
        { status: 404 }
      );
    }

    const formattedWishlist = wishlistItems.map(item => ({
      _id: item._id,
      productId: item.productId, 
      name: item.productDetails.name,
      slug: item.productDetails.slug,
      price: item.productDetails.price,
      imgUrl: item.productDetails.imgUrl,
      description: item.productDetails.description,
      thumbnail: item.productDetails.thumbnail || "", 
      tags: item.productDetails.tags,
      stock: item.productDetails.stock,
      outletId: item.outletDetails._id,
      outletName: item.outletDetails.name,
    }));

    return NextResponse.json(
      { wishlist: formattedWishlist },
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


export async function DELETE(request: NextRequest) {
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

  let objectUserId;
  try {
    objectUserId = new ObjectId(userId); 
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid userId format" },
      { status: 400 }
    );
  }

  try {
    const wishlistItem = await WishlistModel.findOne({
      userId: objectUserId,
      productId: body.productId,
    });

    if (!wishlistItem) {
      return NextResponse.json(
        { error: "Product not found in wishlist" },
        { status: 404 }
      );
    }

    await WishlistModel.deleteOne({
      userId: objectUserId,
      productId: body.productId,
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
