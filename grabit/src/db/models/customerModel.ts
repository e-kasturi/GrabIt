import { z } from "zod";
import { database } from "../config/config";
import { customerType } from "@/type";
import { ObjectId } from "mongodb";
import { hashPass } from "@/helpers/bcrypt";

const customerSchema = z.object({
    name: z.string().min(3, { message: "Name is required."}).max(50),
    email: z.string().email({ message: "Email must be a valid email address"}),
    password: z.string().min(5, {message: "Password must be at least 5 characters long"}),
    address: z.string().min(1, {message: "Address is required"}),
    phone: z
    .string()
    .regex(/^\d{10,14}$/, {message: "Phone number must be valid phone number"}),
    imgUrl: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    role: z
    .string()
    .refine((role) => role === "customer", 
            {message: "Role must be customer"})
})  

class CustomerModel {
    static collection(){
        return database.collection<customerType>("customers")
    }

    static async create(newCustomer: customerType) {
        customerSchema.parse(newCustomer)

        const existsCustomer = await this.collection().findOne({
            email: newCustomer.email,
        })
        if(existsCustomer) {
            throw new Error("Email already exists")
        }

        newCustomer.password = hashPass(newCustomer.password)

        return this.collection().insertOne(newCustomer)
    }

    static async findByEmail(email: string) {
        return this.collection().findOne({ email });
      }

    static async findById(customerId: string) {
        const agg = [
            {
                $match: {
                    _id: new ObjectId(customerId)
                },
            },
            {
                $lookup: {
                    from: "transactions",
                    localField: "_id",
                    foreignField: "customerId",
                    as: "transactions",
                },
            },
            {
                $unwind: {
                    path: "$transactions",
                    preserveNullAndEmptyArrays: true,
                }
            },
            {
                $lookup: {
                    from: "transactionDetails",
                    localField: "transactions._id",
                    foreignField: "transactionId",
                    as: "transactionDetail"
                }
            },
            {
                $unwind: {
                    path: "$transactionDetail",
                    preserveNullAndEmptyArrays: true,
                }
            }
        ]
        return this.collection().aggregate(agg).toArray()
    }
}

export default CustomerModel;   