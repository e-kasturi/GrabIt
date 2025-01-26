"use client";
import { useEffect, useState } from "react";
import { transactionType } from "@/type";
import { getTransactionById } from "@/actions";
import { useRouter } from "next/navigation";

export type transactionProps = {
  params: {
    id: string;
  };
};

export default function TransactionDetail({ params }: transactionProps) {
  const router = useRouter();
  const [transaction, setTransaction] = useState<transactionType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const data = await getTransactionById(params.id);
        if (data && data.length > 0) {
          setTransaction(data[0]);
        } else {
          setError("Transaction not found");
        }
      } catch (err: any) {
        setError("Failed to load transaction data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [params.id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!transaction) {
    return <p>Transaction not found</p>;
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-6 text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-3xl font-semibold text-center text-pink-600 mb-8">
              Transaction Detail
            </h1>
          </div>

          <div className="grid md:grid-cols-2 gap-6 p-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-purple-600">Transaction Info</h2>
              <div className="space-y-3">
                <p className="text-gray-600">
                  <span className="font-medium">Transaction ID:</span>
                  <span className="ml-2">{transaction._id}</span>
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Date:</span>
                  <span className="ml-2">
                    {new Date(transaction.transactionDate).toLocaleDateString()}
                  </span>
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Status:</span>
                  <span className="ml-2 px-3 py-1 rounded-full bg-pink-100 text-pink-800">
                    {transaction.status}
                  </span>
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Total Amount:</span>
                  <span className="ml-2">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(transaction.totalAmount)}
                  </span>
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-purple-600">Customer Details</h2>
              <div className="space-y-3">
                {transaction.customerDetail && transaction.customerDetail[0] && (
                  <>
                    <p className="text-gray-600">
                      <span className="font-medium">Name:</span>
                      <span className="ml-2">{transaction.customerDetail[0].name}</span>
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Phone:</span>
                      <span className="ml-2">{transaction.customerDetail[0].phone}</span>
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Address:</span>
                      <span className="ml-2">{transaction.customerDetail[0].address}</span>
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 bg-pink-50">
            <h2 className="text-xl font-semibold text-purple-600 mb-4">Product</h2>
            <div className="grid gap-4">
              {transaction.productDetail?.map((product, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">{product.name}</span>
                    <span className="text-gray-600">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(product.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
