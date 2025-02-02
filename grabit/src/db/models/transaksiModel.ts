import { ObjectId } from "mongodb";
import { client, database } from "../config/config";
import { z } from "zod";
import ProductModel from "./produkModel";
import { transactionType, updateTransactionType } from "@/type";


export const transactionDetailSchema = z.object({
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().positive(),
  transactionId: z.instanceof(ObjectId).nullable(),
});

export const transactionTypeSchema = z.object({
  transactionDate: z.string(), 
  products: z.array(
    z.object({
      productId: z.string().length(24), 
      quantity: z.number().positive(),
    })
  ),
  outletId: z.string().length(24), 
});

class TransactionModel {
  static collection() {
    return database.collection("transactions");
  }

  static detailCollection() {
    return database.collection("transactionsDetails");
  }

  static formatedDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  static async create({
    userId,
    body,
  }: {
    userId: string;
    body: transactionType; 
  }) {
    if (!body || !body.transactionDate || !body.products || !body.outletId) {
      throw new Error("Missing required fields in the request body");
    }
  
    const { transactionDate, products, outletId } = body;
  
    if (!products || products.length === 0) {
      throw new Error("products cannot be empty.");
    }
  
    await client.connect();
    const session = client.startSession();
  
    try {
      session.startTransaction();
      let totalAmount = 0;
  
      for (const product of products) {
        const productDetail = await ProductModel.findById(product.productId);
        if (productDetail) {
          totalAmount += productDetail.price * product.quantity;
        } else {
          throw new Error(`Product not found: ${product.productId}`);
        }
      }
  
      const transaction = {
        outletId: new ObjectId(outletId),
        customerId: new ObjectId(userId),
        transactionDate: this.formatedDate(new Date(transactionDate)),
        totalAmount,
        status: "pending",
      };
  
      const newTransaction = await this.collection().insertOne(transaction, {
        session,
      });
  
      for (const product of products) {
        await this.detailCollection().insertOne(
          {
            transactionId: newTransaction.insertedId,
            productId: new ObjectId(product.productId),
            quantity: product.quantity,
          },
          { session }
        );
      }
  
      await session.commitTransaction();
      return newTransaction;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
  
  
  static async getById(id: string) {
    const agg = [
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "transactionsDetails",
          localField: "_id",
          foreignField: "transactionId",
          as: "products",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "productDetail",
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "customerDetail",
        },
      },
    ];
    return this.collection().aggregate(agg).toArray();
    
  }

  static async getByCustomerId(customerId: string) {
    const agg = [
      {
        $match: {
          customerId: new ObjectId(customerId),
        },
      },
      {
        $lookup: {
          from: "outlets",
          localField: "outletId",
          foreignField: "_id",
          as: "outletDetail",
        },
      },
      {
        $lookup: {
          from: "transactionsDetails",
          localField: "_id",
          foreignField: "transactionId",
          as: "products",
        },
      },
      {
        $lookup: {
          from: "products", 
          localField: "products.productId",
          foreignField: "_id",
          as: "productDetail",
        },
      },
      
    ];
  
    return this.collection().aggregate(agg).toArray();
  }
  

  static async getByOutletId(outletId: string) {
    console.log('OutletId:', new ObjectId(outletId));

    const agg = [
      
      {
        
        $match: {
          
          outletId: new ObjectId(outletId), 
       
        },
      },
      {
        $lookup: {
          from: "transactionsDetails", 
          localField: "_id", 
          foreignField: "transactionId", 
          as: "products", 
        },
      },
      {
        $lookup: {
          from: "products", 
          localField: "products.productId", 
          foreignField: "_id", 
          as: "productDetail",
        },
      },
      {
        $lookup: {
          from: "customers", 
          localField: "customerId", 
          foreignField: "_id", 
          as: "customerDetail",
        },
      },
      {
        $project: {
          products: 0, 
        },
      },
    ];
  
    return this.collection().aggregate(agg).toArray();
  }
  
  
  static async savePaymentLink(id: string, paymentLink: string) {
    await this.collection().updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          paymentLink: paymentLink,
        },
      }
    );
  }

  static async updateTransaction(
    id: string,
    products: updateTransactionType[],
    status: string
  ) {
    await client.connect();
    const session = client.startSession();

    try {
      session.startTransaction();
      let totalAmount = 0;
      const transaction = await this.collection().findOne({
        _id: new ObjectId(id),
      });

      for (const product of products) {
        const productDetail = await ProductModel.findById(product.productId);

        if (productDetail) {
          totalAmount += productDetail.price * product.quantity;
        }

        await this.detailCollection().updateOne(
          {
            transactionId: new ObjectId(id),
            productId: new ObjectId(product.productId),
          },
          {
            $set: {
              quantity: product.quantity,
              total: productDetail
                ? productDetail.price * product.quantity
                : 0,
            },
          },
          { session }
        );
      }

      await this.collection().updateOne(
        {
          _id: new ObjectId(transaction?._id),
        },
        {
          $set: {
            totalAmount: totalAmount,
          },
        },
        { session }
      );

      session.commitTransaction();
      return transaction;
    } catch (error) {
      session.abortTransaction();
      throw error;
    }
  }

  static async updateStatus(id: string, status: string) {
    return this.collection().updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          status: status,
        },
      }
    );
  }

  static async deleteTransaction(id: string) {
    return this.collection().deleteOne({ _id: new ObjectId(id) });
  }

  static async reportDaily(outletId: string, date: Date) {
    const agg = [
      {
        $match: {
          outletId: new ObjectId(outletId),
          transactionDate: this.formatedDate(date),
        },
      },
      {
        $lookup: {
          from: "transactionDetails",
          localField: "_id",
          foreignField: "transactionId",
          as: "products",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "productDetail",
        },
      },
      {
        $project: {
          services: 0,
        },
      },
    ];

    return this.collection().aggregate(agg).toArray();
  }

  static async reportWeekly(outletId: string, startDate: Date, endDate: Date) {
    const agg = [
      {
        $match: {
          outletId: new ObjectId(outletId),
          transactionDate: {
            $gte: this.formatedDate(startDate),
            $lte: this.formatedDate(endDate),
          },
        },
      },
      {
        $lookup: {
          from: "transactionDetails",
          localField: "_id",
          foreignField: "transactionId",
          as: "products",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "productDetail",
        },
      },
      {
        $project: {
          services: 0,
        },
      },
    ];

    return this.collection().aggregate(agg).toArray();
  }

  static async reportMonthly(outletId: string, startDate: Date, endDate: Date) {
    const agg = [
      {
        $match: {
          outletId: new ObjectId(outletId),
          transactionDate: {
            $gte: this.formatedDate(startDate),
            $lte: this.formatedDate(endDate),
          },
        },
      },
      {
        $lookup: {
          from: "transactionDetails",
          localField: "_id",
          foreignField: "transactionId",
          as: "products",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "productDetail",
        },
      },
      {
        $project: {
          services: 0,
        },
      },
    ];

    return this.collection().aggregate(agg).toArray();
  }

  static async reportYearly(outletId: string, startDate: Date, endDate: Date) {
    const agg = [
      {
        $match: {
          outletId: new ObjectId(outletId),
          transactionDate: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $lookup: {
          from: "transactionDetails",
          localField: "_id",
          foreignField: "transactionId",
          as: "products",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "productDetail",
        },
      },
      {
        $project: {
          services: 0,
        },
      },
    ];

    return this.collection().aggregate(agg).toArray();
  }

  static async reportCustom(outletId: string, startDate: Date, endDate: Date) {
    const agg = [
      {
        $match: {
          outletId: new ObjectId(outletId),
          transactionDate: {
            $gte: this.formatedDate(startDate),
            $lte: this.formatedDate(endDate),
          },
        },
      },
      {
        $lookup: {
          from: "transactionDetails",
          localField: "_id",
          foreignField: "transactionId",
          as: "products",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "productDetail",
        },
      },
      {
        $project: {
          services: 0,
        },
      },
    ];

    return this.collection().aggregate(agg).toArray();
  }

  static async findWithDetails(query: object) {
    const agg = [
      { $match: query },
      {
        $lookup: {
          from: "transactionDetails", 
          localField: "_id",
          foreignField: "transactionId",
          as: "products",
        },
      },
      {
        $lookup: {
          from: "products", 
          localField: "products.productId",
          foreignField: "_id",
          as: "productDetail",
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "customerDetail",
        },
      },
      {
        $unwind: { path: "$customerDetail", preserveNullAndEmptyArrays: true },
      },
      {
        $unwind: { path: "$productDetail", preserveNullAndEmptyArrays: true },
      },
    ];
  
    return this.collection().aggregate(agg).toArray();
  }
  
}

export default TransactionModel;
