"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { transactionType } from "@/type";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<transactionType[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<transactionType[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const statusOptions = [
    "all",
    "pending",
    "dikemas",
    "dikirim",
    "selesai",
    "pengembalian",
    "dibatalkan",
  ];

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/outlets/transaction");
        if (!response.ok) throw new Error("Failed to fetch transactions");
        const data = await response.json();
        console.log(data, ">>> data transaksi");
        setTransactions(data);
        setFilteredTransactions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleFilterChange = (status: string) => {
    console.log(status, ">>>> status yang dipilih");
    setActiveFilter(status);
    if (status === "all") {
      setFilteredTransactions(transactions);
    } else {
      const filtered = transactions.filter((t) => t.status === status);
      console.log(filtered, ">>>> transaksi yang difilter");
      setFilteredTransactions(filtered);
    }
  };

  const updateTransactionStatus = async (
    transactionId: string,
    newStatus: string
  ) => {
    try {
      if (newStatus === "selesai") {
        const response = await fetch(`/api/midtrans/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transactionId,
            totalAmount: transactions.find((t) => t._id === transactionId)
              ?.totalAmount,
          }),
        });

        const result = await response.json();
        console.log(transactions, result, "<<<<<<< response");
      }
      const response = await fetch(
        `/api/outlets/transaction/${transactionId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (!response.ok) throw new Error("Failed to update transaction status");

      const updatedTransaction = await response.json();
      setTransactions((prevTransactions) =>
        prevTransactions.map((transaction) =>
          transaction._id === transactionId
            ? { ...transaction, status: updatedTransaction.status }
            : transaction
        )
      );
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen px-4">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen px-4">
        <svg
          className="animate-spin h-16 w-16 text-pink-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
          ></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[95%] mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold text-purple-600 mb-8">
          Transaction List
        </h1>

        <div className="flex flex-wrap gap-4 mb-6 bg-pink-100 p-4 rounded-lg shadow-lg">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => handleFilterChange(status)}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                activeFilter === status
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="bg-white shadow-xl rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-purple-100 text-black">
                <tr>
                  <th className="py-4 px-6 text-left text-base font-bold text-gray-800">
                    Status
                  </th>
                  <th className="py-4 px-6 text-left text-base font-bold text-gray-800">
                    Total Amount
                  </th>
                  <th className="py-4 px-6 text-left text-base font-bold text-gray-800">
                    Customer Detail
                  </th>
                  <th className="py-4 px-6 text-left text-base font-bold text-gray-800">
                    Tanggal
                  </th>
                  <th className="py-4 px-6 text-left text-base font-bold text-gray-800">
                    Product Detail
                  </th>
                  <th className="py-4 px-6 text-left text-base font-bold text-gray-800">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="border-b hover:bg-purple-50 transition-colors"
                  >
                    <td className="py-4 px-6 text-sm text-gray-700">
                      <select
                        value={transaction.status}
                        onChange={(e) => {
                          if (transaction._id) {
                            updateTransactionStatus(
                              transaction._id,
                              e.target.value
                            );
                          }
                        }}
                        className="bg-gray-100 text-sm text-gray-700 p-2 rounded-md"
                      >
                        <option value="pending">Pending</option>
                        <option value="dikemas">Dikemas</option>
                        <option value="dikirim">Dikirim</option>
                        <option value="selesai">Selesai</option>
                        <option value="pengembalian">Pengembalian</option>
                        <option value="dibatalkan">Dibatalkan</option>
                      </select>
                    </td>

                    <td className="py-4 px-6 text-sm text-gray-700">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(transaction.totalAmount)}
                    </td>

                    <td className="py-4 px-6 text-sm text-gray-700">
                      {transaction.customerDetail?.length && (
                        <div className="flex flex-col space-y-1">
                          <span className="font-medium">
                            <strong>
                              {transaction.customerDetail[0].name}
                            </strong>
                          </span>
                          <span className="text-gray-500">
                            Phone: {transaction.customerDetail[0].phone}
                          </span>
                          <span className="text-gray-500">
                            Address: {transaction.customerDetail[0].address}
                          </span>
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-6 text-sm text-gray-700">
                      {transaction.transactionDate}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">
                      {transaction.productDetail?.length &&
                        transaction.productDetail.map((product, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col space-y-1 mb-2 last:mb-0"
                          >
                            <span className="font-medium text-gray-900">
                              {product.name}
                            </span>
                            <span className="text-gray-500">
                              {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                              }).format(product.price)}
                            </span>
                          </div>
                        ))}
                    </td>

                    <td className="py-4 px-6 text-sm text-center">
                      <div className="flex justify-center gap-4">
                        <Link
                          href={`/outlet/transaction/edit/${transaction._id}`}
                        >
                          <button className="bg-purple-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-purple-700 transition duration-200">
                            Edit
                          </button>
                        </Link>
                        <Link href={`/outlet/transaction/${transaction._id}`}>
                          <button className="bg-pink-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-pink-700 transition duration-200">
                            Detail
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-100">
                  <td className="py-4 px-6 text-sm text-gray-700 font-medium">
                    Total
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700 font-medium">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(
                      filteredTransactions.reduce(
                        (total, transaction) => total + transaction.totalAmount,
                        0
                      )
                    )}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700 font-medium"></td>
                  <td className="py-4 px-6 text-sm text-gray-700 font-medium"></td>
                  <td className="py-4 px-6 text-sm text-gray-700 font-medium"></td>
                  <td className="py-4 px-6 text-sm text-gray-700 font-medium"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
