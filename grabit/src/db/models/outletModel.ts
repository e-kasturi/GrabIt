import { z } from "zod";
import { database } from "../config/config";
import { outletType } from "@/type";
import { hashPass } from "@/helpers/bcrypt";
import { ObjectId } from "mongodb";

const outletSchema = z.object({
  name: z.string().min(1, "Name is required."),
  nameOutlet: z.string(),
  address: z.string().min(1, "Address is required."),
  phone: z
    .string()
    .regex(/^\+?\d{10,15}$/, "Phone must be a valid phone number."),
  email: z.string().email("Email must be a valid email address."),
  password: z.string().min(5, "Password must be at least 8 characters long."),
});

class OutletModel {
  static collection() {
    return database.collection<outletType>("outlets");
  }

  static async create(outlet: outletType) {
    outletSchema.parse(outlet);

    const existOutlet = await this.collection().findOne({
      email: outlet.email,
    });
    if (existOutlet) {
      throw new Error("Outlet with this email already exists");
    }

    outlet.password = hashPass(outlet.password);

    return this.collection().insertOne(outlet);
  }

  static async findByEmail(email: string) {
    return this.collection().findOne({ email });
  };

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
