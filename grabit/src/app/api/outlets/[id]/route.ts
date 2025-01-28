import OutletModel from "@/db/models/outletModel";

export async function GET(request: Request) {
  const outletId = request.headers.get("x-user-id") as string;
  const outlet = await OutletModel.findById(outletId);

  return Response.json(outlet);
}