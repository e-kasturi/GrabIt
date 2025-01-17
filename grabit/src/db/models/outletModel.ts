import { hashPass } from "@/helpers/bcrypt";
import { outletType } from "@/type";
import { z } from "zod";
import { database } from "../config/config";
import { ObjectId } from "mongodb";

const outletSchema = z.object({
  name: z.string().nonempty("Name is required"),
  namaOutlet: z.string().nonempty("Outlet name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(5, "Password must be at least 5 characters"),
  phone: z
    .string()
    .regex(/^\d{10,14}$/, "Invalid phone number")
    .nonempty("Phone number is required"),
  address: z.string().nonempty("Address is required"),
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