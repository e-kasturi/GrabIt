import BalanceModel from "@/db/models/balanceModel";

export async function GET(request: Request) {
  const outletId = request.headers.get("x-user-id") as string;
  const simple = request.headers.get("x-simple") === "true";

  if (simple) {
    const balance = await BalanceModel.getBalanceSimple(outletId);
    return Response.json(balance);
  } // Hanya saldo dan outletId aja

  const balance = await BalanceModel.getBalance(outletId);
  return Response.json(balance);
  // saldo + history wd
}

export async function PATCH(request: Request) {
  const outletId = request.headers.get("x-user-id") as string;
  const { withdraw } = await request.json();

  await BalanceModel.withdrawBalance(outletId, withdraw);

  return Response.json({ message: "Balance updated" });
}
