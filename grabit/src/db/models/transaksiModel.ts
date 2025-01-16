import { ObjectId } from "mongodb";
import { client, database } from "../config/config";
import { z } from "zod"
import ProductModel from "./produkModel";
import { transactionType, updateTransactionType } from "@/type";
import { time } from "console";

export const transactionDetailSchema = z.object({
 name: z.string(),
 price: z.number().positive(),
 quantity: z.number().positive(),
 transactionId: z.instanceof(ObjectId).nullable(),
  });

  export const transactionSchema = z.object({
    userId: z.string(),
    customerName: z.string(),
    customerAddress: z.string(),
    totalAmount: z.number().positive(),
    date: z.string(),
    status: z.string(),
    details: z.array(z.instanceof(ObjectId)),
  })
  
  class TransactionModel {
    static collection() {
      return database.collection("transactions");
    }
  
    static detailCollection(){
        return database.collection("transactionsDetails")
    }

    static formatedDate(date: Date) {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")

        return `${year}-${month}-${day}`
    }

    static async create({
        userId,
        body,
    }: {
        userId: string
        body: transactionType
    }) {
        const { transactionDate, products, outletId } = body
        if (!products || products.length === 0) {
            throw new Error("Produk connot be empty")
        }
        await client.connect()
        const session = client.startSession()
        try{
            session.startTransaction()

            const transaction = {
                outletId: new ObjectId(outletId),
                customerId: new ObjectId(userId),
                transactionDate: this.formatedDate( new Date(transactionDate)),
                totalAmount: 0,
                status: "pending",
            }
            const newTransaction = await this.collection().insertOne(transaction, {
                session,
            })

            for (const product of products){
                await this.detailCollection().insertOne(
                    {
                        transactionId: newTransaction.insertedId,
                        produkId: new ObjectId(product.productId)
                    },
                    { session}
                )
            }
            session.commitTransaction()
            return newTransaction
        } catch (error){
            session.abortTransaction()
            await client.close()
        }
    }
  
    static async getById(id: string) {
      const agg = [
        {
          $match: {
            _id: new ObjectId(id)
          }
        },
        {
          $lookup: {
            from: "transactionDetails",
            localField: "_id",
            foreingField: "transactionId",
            as: "products",
          }
        },
        {
          $lookup: {
            from: "products",
            localField: "products.productId",
            foreingField: "_id",
            as: "productDetail",
          }
        },
        {
          $lookup: {
            from: "customer",
            localField: "customerId",
            foreingField: "_id",
            as: "customerDetail",
          }
        }
      ]
      return this.collection().aggregate(agg).toArray()
    }
   
    static async getByCustomerId(customerId: string){
      const agg = [
        {
          $match: {
            _id: new ObjectId(customerId)
          }
        },
        {
          $lookup: {
            from: "transactionDetails",
            localField: "_id",
            foreingField: "transactionId",
            as: "products",
          }
        },
        {
          $lookup: {
            from: "products",
            localField: "products.productId",
            foreingField: "_id",
            as: "productDetail",
          }
        },
        {
          $lookup: {
            from: "outlets",
            localField: "outletId",
            foreingField: "_id",
            as: "outletDetail",
          }
        }
      ]
      return this.collection().aggregate(agg).toArray()
    }

    static async getByOutletId(outletId: string){
      const agg = [
        {
          $match: {
            _id: new ObjectId(outletId)
          }
        },
        {
          $lookup: {
            from: "transactionDetails",
            localField: "_id",
            foreingField: "transactionId",
            as: "products",
          }
        },
        {
          $lookup: {
            from: "products",
            localField: "products.productId",
            foreingField: "_id",
            as: "productDetail",
          }
        },
        {
          $lookup: {
            from: "outlets",
            localField: "outletId",
            foreingField: "_id",
            as: "outletDetail",
          }
        },
        {
          $project: {
            products: 0,
          }
        }
      ]
      return this.collection().aggregate(agg).toArray()
    }

    static async savePaymentLink(id: string, paymentLink: string){
      await this.collection().updateOne(
        {
          _id: new ObjectId(id)
        },
        {
          $set: {
            paymentLink: paymentLink
          }
        }
      )
    }

    static async updateTransaction(
      id: string,
      products: updateTransactionType[],
      status: string
    ) {
      console.log(products, "productss");
      await client.connect()
      const session = client.startSession()

      try {
        session.startTransaction()
        let totalAmount = 0
        const transaction = await this.collection().findOne({
          _id: new ObjectId(id)
        })
        console.log((transaction, "transaksi"));
        
        for (const product of products) {
          const productDetail = await ProductModel.findById(product.productId)

          console.log(productDetail, "produk detail");
          
          if(productDetail){
            totalAmount += productDetail.price * product.quantity
          }

          const detailTrans = await this.detailCollection().updateOne(
            {
              transactionId: new ObjectId(id),
              productId: new ObjectId(product.productId)
            },
            {
              $set: {
                quantity: product.quantity,
                total: productDetail ? productDetail.price * product.quantity : 0
              }
            },
            { session }
          )
          console.log((detailTrans, "detail transaksi"));
        }

        const updateTransaction = await this.collection().updateOne(
          {
            _id: new ObjectId(transaction?._id)
          },
          {
            $set: {
              totalAmount: totalAmount
            }
          },
          { session }
        )

        session.commitTransaction()
        return updateTransaction
      } catch (error) {
        session.abortTransaction()
        throw error
      }
    }

    static async updateStatus(id: string, status: string){
      return this.collection().updateOne(
        {
          _id: new ObjectId(id)
        },
        {
          $set: {
            status: status
          }
        }
      )
    }

    static async deleteTransaction(id: string){
      return this.collection().deleteOne({ _id: new ObjectId(id)})
    }
  }

  export default TransactionModel