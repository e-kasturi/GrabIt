import { hashPass } from "@/helpers/bcrypt";
import { outletType } from "@/type";
import { z } from "zod";
import { database } from "../config/config";
import { ObjectId } from "mongodb";

const outletSchema = z.object({
    name: z.string(),
    nameOutlet: z.string().min(1, "Name is required"),
    email: z.string().email("Email must be a valid email address"),
    password: z.string().min(5, "Password must be at least 5 characters long"),
    address: z.string().min(1, "Address is required"),
    phone: z
    .string()
    .regex(/^\d{10,14}$/, "Phone number must be valid phone number"),
});

class OutletModel {
 static collection() {
    return database.collection<outletType>("outlets");
 }
    static async create(outlet: outletType) {
        outletSchema.parse(outlet)

        const exsistOutlet = await this.collection().findOne({
            email: outlet.email,
        })
        if (exsistOutlet) {
            throw new Error("Outlet with this email already exists")
        }

        outlet.password = hashPass(outlet.password)

        return this.collection().insertOne(outlet)
    }

    static async findByEmail(email: string) {
        return this.collection().findOne({ email })
    }

    static async findAll() {
        const agg = [
          {
            $project: {
              password: 0,
            },
          },
        ];
        return this.collection().aggregate(agg).toArray();
      }

   static async findById(id: string) {
    const agg = [
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      {
        $project: {
          password: 0,
        },
      },
    ];
    return this.collection().aggregate(agg).toArray();
  }
}
export default OutletModel;