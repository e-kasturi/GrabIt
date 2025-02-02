import TransaksiModel from "@/db/models/transaksiModel";
import { MidtransClient } from "midtrans-node-client";

let snap = new MidtransClient.Snap({
  isProduction: false,  // Pastikan sesuai dengan environment Anda (false untuk sandbox)
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export async function POST(request: Request) {
  try {
    // Ambil data dari request
    const { totalAmount, transactionId } = await request.json();
    console.log(totalAmount, transactionId, 'midtrans');

    // Ambil transaksi dari database
    const transaction = await TransaksiModel.getById(transactionId);

    if (!transaction[0].paymentLink) {
      // Persiapkan parameter untuk transaksi
      let parameter = {
        transaction_details: {
          order_id: transactionId,
          gross_amount: totalAmount,
        },
      };

      console.log('Request to Midtrans:', parameter);

      // Buat transaksi menggunakan Midtrans API
      const transactionToken = await snap.createTransaction(parameter);
      console.log('Midtrans Response:', transactionToken);

      // Simpan payment link ke database
      await TransaksiModel.savePaymentLink(transactionId, transactionToken.redirect_url);

      // Kembalikan response dengan URL redirect
      return Response.json({ transactionToken });
    } else {
      return Response.json({ message: "Transaction already paid" });
    }
  } catch (error) {
    console.error('Midtrans Error:', error);

    if (error instanceof Error) {
      return Response.json({ message: 'Transaction creation failed', error: error.message });
    } else {
      return Response.json({ message: 'Unknown error', error: String(error) });
    }
  }
}
