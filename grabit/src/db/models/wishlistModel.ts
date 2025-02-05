import { database } from "../config/config";
import { ObjectId } from "mongodb";
import { z } from "zod";

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

  static toObjectId(id: string | ObjectId): ObjectId {
    if (id instanceof ObjectId) {
      return id; 
    }
    return new ObjectId(id); 
  }
  static async create(newWishlist: WishlistType) {
    wishlistSchema.parse(newWishlist); 
    newWishlist.userId = this.toObjectId(newWishlist.userId);
    newWishlist.productId = this.toObjectId(newWishlist.productId);

    return await this.collection().insertOne(newWishlist);
  }

  static async findByUserId(userId: string | ObjectId) {
    const objectId = this.toObjectId(userId);
  
    const agg = [
      { $match: { userId: objectId } },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "outlets",
          localField: "productDetails.outletId", 
          foreignField: "_id",
          as: "outletDetails",
        },
      },
      { $unwind: { path: "$outletDetails", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          productId: "$productDetails._id", 
          "productDetails.name": 1,
          "productDetails.slug": 1,
          "productDetails.price": 1,
          "productDetails.imgUrl": 1,
          "productDetails.stock": 1,
          "productDetails.description": 1,
          "productDetails.tags": 1,
          "outletDetails._id": 1, 
          "outletDetails.name": 1,
        },
      },
    ];
  
    return await this.collection().aggregate(agg).toArray();
  }
  

  static async findByProductId(productId: string) {
    const objectId = this.toObjectId(productId);
    return await this.collection().find({ productId: objectId }).toArray();
  }

  static async deleteById(id: string) {
    const objectId = this.toObjectId(id);
    return await this.collection().deleteOne({ _id: objectId });
  }

  static async deleteByUserAndProduct(userId: string, productId: string) {
    const userObjectId = this.toObjectId(userId);
    const productObjectId = this.toObjectId(productId);

    return await this.collection().deleteOne({
      userId: userObjectId,
      productId: productObjectId,
    });
  }

  static async deleteOne(query: Record<string, any>) {
    const filter: WishlistFilter = {};

    if (query.userId) {
      filter.userId = this.toObjectId(query.userId);  
    }
    if (query.productId) {
      filter.productId = this.toObjectId(query.productId);  
    }

    return await this.collection().deleteOne(filter);
  }

  static async find(query: Record<string, any>) {
    const filter: WishlistFilter = {}; 

    if (query.userId) {
      filter.userId = this.toObjectId(query.userId);  
    }
    if (query.productId) {
      filter.productId = this.toObjectId(query.productId);  
    }

    return await this.collection().find(filter).toArray();
  }

  static async findOne(query: Record<string, any>) {
    const filter: WishlistFilter = {};

    if (query.userId) {
      filter.userId = this.toObjectId(query.userId);  
    }
    if (query.productId) {
      filter.productId = this.toObjectId(query.productId);  
    }

    return await this.collection().findOne(filter);
  }

  static async getProductById(productId: string) {
    const objectId = this.toObjectId(productId);
    console.log('Searching for product with ID:', objectId); 

    const product = await database.collection("products").findOne({ _id: objectId });

    if (!product) {
        console.log('Product not found'); 
    }

    return product;
  }
}

export default WishlistModel;
