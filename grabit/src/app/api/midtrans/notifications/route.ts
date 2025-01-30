import TransaksiModel from "@/db/models/transaksiModel";

export async function POST(request: Request) {
  const body = await request.json();
  let status = "paid";
  console.log("POST", body);

  await TransaksiModel.updateStatus(body.order_id, status);

  return Response.json({ message: "Notification received" });
}
