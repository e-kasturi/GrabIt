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
}

export default BalanceModel