import BalanceModel from "@/db/models/balanceModel";
import CustomerModel from "@/db/models/customerModel";
import OutletModel from "@/db/models/outletModel";

import errorHandler from "@/helpers/errorHandler";

export async function POST(request: Request) {
  try {
    const form = await request.json();

    if (form.role === "customer") {
      const newCostumer = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        imgUrl: form.imgUrl,
        address: form.address,
        phone: form.phone,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
      };
      await CustomerModel.create(newCostumer);
    } else {
      const newOutlet = {
        name: form.name,
        nameOutlet: form.nameOutlet,
        phone: form.phone,
        email: form.email,
        password: form.password,
        role: form.role,
        address: form.address,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
      };
      const outlet = await OutletModel.create(form);
      await BalanceModel.create(outlet.insertedId);
    }

    return Response.json({
      message: "Created successfully",
    });
  } catch (error) {
    return errorHandler(error);
  }
}
