import CustomerModel from "@/db/models/customerModel";
import OutletModel from "@/db/models/outletModel";
import { comparePass } from "@/helpers/bcrypt";
import { signToken } from "@/helpers/jwt";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const body: { email: string; password: string; role: string } =
    await request.json();
  if (!body.email || !body.password || !body.role) {
    return Response.json(
      { message: "Email, password, and role are required" },
      { status: 400 }
    );
  }
  let user;
  if (body.role === "customer") {
    user = await CustomerModel.findByEmail(body.email);
  } else if (body.role === "admin") {
    user = await OutletModel.findByEmail(body.email);
  }

  if (!user) {
    throw { message: "Invalid email/password", status: 401 };
  }

  const compared = comparePass(body.password, user.password);
  if (!compared) {
    throw { message: "Invalid email/password", status: 401 };
  }

  const access_token = signToken({
    _id: user._id.toString(),
    email: user.email,
  });

  cookies().set({
    name: "authorization",
    value: `Bearer ${access_token}`,
  });

  return Response.json({
    message: "success Login",
    access_token,
  });
}
