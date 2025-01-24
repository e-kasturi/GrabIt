import { z } from "zod";
import { database } from "../config/config";
import { ObjectId } from "mongodb";

const wishlistSchema = z.object({
  userId: z.union([z.string(), z.instanceof(ObjectId)]),
  productId: z.union([z.string(), z.instanceof(ObjectId)]),
});

type WishlistFilter = {
    userId?: ObjectId;
    productId?: ObjectId;
  };

type WishlistType = z.infer<typeof wishlistSchema>;

class WishlistModel {

  static collection() {
    return database.collection("wishlists");
  }

 
  static async create(newWishlist: WishlistType) {
    wishlistSchema.parse(newWishlist); 
    newWishlist.userId = new ObjectId(newWishlist.userId);
    newWishlist.productId = new ObjectId(newWishlist.productId);

    return await this.collection().insertOne(newWishlist);
  }

  static async findByUserId(userId: string) {
    const objectId = new ObjectId(userId);

    const agg = [
      {
        $match: {
          userId: objectId,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: {
          path: "$productDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          "productDetails.name": 1,
          "productDetails.slug": 1,
          "productDetails.price": 1,
          "productDetails.imgUrl": 1,
          "productDetails.stock": 1,
          "productDetails.description": 1,
          "productDetails.tags": 1,
        },
      },
    ];

    return await this.collection().aggregate(agg).toArray();
  }

  static async findByProductId(productId: string) {
    const objectId = new ObjectId(productId);
    return await this.collection().find({ productId: objectId }).toArray();
  }

  static async deleteById(id: string) {
    const objectId = new ObjectId(id);
    return await this.collection().deleteOne({ _id: objectId });
  }

  static async deleteByUserAndProduct(userId: string, productId: string) {
    const userObjectId = new ObjectId(userId);
    const productObjectId = new ObjectId(productId);

    return await this.collection().deleteOne({
      userId: userObjectId,
      productId: productObjectId,
    });
  }

 static async find(query: Record<string, any>) {
    const filter: WishlistFilter = {}; 

    if (query.userId) {
      filter.userId = new ObjectId(query.userId);  
    }
    if (query.productId) {
      filter.productId = new ObjectId(query.productId);  
    }

    return await this.collection().find(filter).toArray();
  }
}

export default WishlistModel;
