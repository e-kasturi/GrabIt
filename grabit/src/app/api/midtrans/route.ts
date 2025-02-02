import TransaksiModel from "@/db/models/transaksiModel";
import { MidtransClient } from "midtrans-node-client";

let snap = new MidtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export async function POST(request: Request) {
  try {
    const { totalAmount, transactionId } = await request.json();
    console.log(totalAmount, transactionId, 'midtrans');

    const transaction = await TransaksiModel.getById(transactionId);
    if (!transaction || transaction.length === 0) {
      return Response.json({ error: "Transaction not found" }, { status: 404 });
    }

    if (!transaction[0].paymentLink) {
      let parameter = {
        transaction_details: {
          order_id: transactionId,
          gross_amount: totalAmount,
        },
      };

      const transactionToken = await snap.createTransaction(parameter);
      console.log(transactionToken, "<<<< Midtrans Response");

      if (!transactionToken.redirect_url) {
        return Response.json({ error: "Failed to generate payment link from Midtrans" }, { status: 500 });
      }

      await TransaksiModel.savePaymentLink(transactionId, transactionToken.redirect_url);
      return Response.json({ paymentLink: transactionToken.redirect_url });
    } else {
      return Response.json({ message: "Transaction already paid" });
    }
  } catch (error) {
    console.log(error, "<<<<<<<< error line 24");
    return Response.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
