import { ObjectId } from "mongodb";
import { database } from "../config/config";

class BalanceModel {
    static collection(){
        return database.collection("balances")
    }

    static collectionWithdraw() {
        return database.collection("withdraws")
    }

    static async create(id: ObjectId){
        const outletBalance = {
            outletId: id,
            balance: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        }
        return this.collection().insertOne(outletBalance)
    }

    static async updateBalance(id: ObjectId, balance: number){
        return this.collection().updateOne(
            {outletId: id},
            {
                $inc: {
                    balance: balance
                },
                $set: {
                    updatedAt: new Date()
                }
            }
        )
    }

    static async getBalance(id: string){
        const outletId = new ObjectId(id)
        const agg = [
            {
                $match: {
                    outletId: outletId
                }
            },
            {
                $lookup: {
                    from: "withdraws",
                    localField: "outletId",
                    foreignField: "outletId",
                    as: "withdraws"
                }
            }
        ]
        return this.collection().aggregate(agg).toArray()
    }

    static async getBalanceSimple(id: string) {
        const outletId = new ObjectId(id)
        return this.collection().findOne(
            {outletId: outletId},
            {projection: { balance:1, outletId: 1}}
        )
    }

    static async withdrawBalance(id: string, amount: number) {
        const outletId = new ObjectId(id)
        const withdraw = {
            outletId: outletId,
            amount: amount,
            createdAt: new Date()
        }

        await this.collectionWithdraw().insertOne(withdraw)
        return this.collection().updateOne(
            {
                outletId: outletId,
                balance: { $gte: amount },
            },
            {
                $inc: {
                    balance: -amount,
                },
                $set: {
                    updatedAt: new Date()
                }
            },
        )
    }
}

export default BalanceModel