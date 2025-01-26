import { productType } from "@/type";
import { database } from "../config/config";
import { z } from "zod";
import { ObjectId } from "mongodb";

const produkSchema = z.object({
  name: z.string(),
  slug: z.string(),
  price: z.number(),
  stock: z.number(),
  imgUrl: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
});

class ProductModel {
  static collection() {
    return database.collection<productType>("products");
  }

  static async create(newProduk: productType) {
    produkSchema.parse(newProduk);
    newProduk.slug = newProduk.name.toLowerCase().replace(/\s+/g, "-");

    return await this.collection().insertOne(newProduk);
  }

  static async findAll() {
    return await this.collection().find().toArray();
  }

  static async findBySlug(slug: string) {
    const product = await this.collection().findOne({
      slug: slug,
    });
    return product;
  }

  static async deleteBySlug(slug: string) {
    return await this.collection().deleteOne({ slug: slug });
  }

  static async updateBySlug(slug: string, newProduk: productType) {
    newProduk.slug = newProduk.name.toLowerCase().replace(/\s+/g, "-");
    return await this.collection().updateOne(
      { slug: slug },
      {
        $set: {
          ...newProduk,
          outletId: new ObjectId(newProduk.outletId),
        },
      }
    );
  }

  static async findById(id: string) {
    return await this.collection().findOne({ _id: new ObjectId(id) });
  }

  static async findAllwithOutletDetails(): Promise<productType[]> {
    const agg = [
      {
        $addFields: {
          outletObjectId: { $toObjectId: "$outletId" },
        },
      },
      {
        $lookup: {
          from: "outlets",
          localField: "outletObjectId",
          foreignField: "_id",
          as: "outletDetails",
        },
      },
      {
        $unwind: {
          path: "$outletDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          name: 1,
          slug: 1,
          price: 1,
          imgUrl: 1,
          stock: 1,
          description: 1,
          tags: 1,
          "outletDetails.name": 1,
          "outletDetails.nameOutlet": 1,
          "outletDetails.phone": 1,
          "outletDetails.email": 1,
          "outletDetails.address": 1,
        },
      },
    ];

    return (await this.collection().aggregate(agg).toArray()) as productType[];
  }

  static async findByOutletId(outletId: string) {
    const objectId = new ObjectId(outletId);
    console.log("objectId", objectId);
    return await this.collection().find({ outletId: objectId }).toArray();
  }

  static async find(query: Record<string, any>) {
    return await this.collection().find(query).toArray();
  }

}

export default ProductModel;
