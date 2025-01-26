"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { transactionType } from "@/type";

const EditTransaction = () => {
  const router = useRouter();
  const { id } = useParams();
  const [products, setProducts] = useState<{
    _id: string;
    name: string | undefined;
    price: number | undefined;
    qty: number;
  }[]>([]);

  const [transactions, setTransactions] = useState({
    _id: "",
    customerName: "",
    customerAddress: "",
    transactionDate: "",
    status: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      setLoading(true);
      console.log("Fetching service for id:", id);
      fetch(`/api/outlets/transaction/${id}`)
        .then((res) => res.json())
        .then((data: transactionType[]) => {
          if (data) {
            console.log("Transaction data:", data);
            const { _id, customerDetail, transactionDate, status } = data[0];
            if (customerDetail) {
              setTransactions({
                _id: _id?.toString() || "",
                customerName: customerDetail[0].name,
                customerAddress: customerDetail[0].address,
                transactionDate,
                status,
              });
            }
            if (data[0].productDetail && data[0].products) {
              const newProducts = data[0].productDetail.map((product, idx) => {
                return {
                  _id: product._id?.toString() || "",
                  name: product.name,
                  price: product.price,
                  qty: data[0].products ? data[0].products[idx].quantity : 0,
                };
              });

              console.log("products data:", newProducts);
              setProducts(newProducts);
            }
          }
        })
        .catch((err) => {
          setError("Error fetching transaction data.");
          console.error("Error fetching transaction:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { customerName, customerAddress, transactionDate, status } = transactions;

    if (!customerName || !customerAddress || !transactionDate || !status) {
      setError("All fields are required!");
      return;
    }

    const updatedTransaction = {
      customerName,
      customerAddress,
      transactionDate,
      status,
      products: products.map((product) => ({
        productId: product._id,
        qty: product.qty,
      })),
    };

    console.log("Updated product data before sending:", updatedTransaction);
    console.log("products data before sending:", products);

    try {
      const response = await fetch(`/api/outlets/transaction/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTransaction),
      });

      const responseData = await response.json();
      console.log("Response data from server:", responseData);
      if (response.ok) {
        console.log("Transaction successfully updated");
        router.push(`/outlet/transaction`);
      } else {
        console.error("Server error:", responseData);
        setError(responseData.message || "Failed to update service.");
      }
    } catch (err) {
      console.error("Network error:", err);
      setError("An error occurred while updating the service.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <svg
          className="animate-spin h-10 w-10 text-blue-500"
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
    <div className="max-w-4xl mx-auto p-8 mt-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">
        Edit Transaction
      </h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <button
        onClick={() => {
          router.back();
          router.refresh();
        }}
        className="mb-4 text-white bg-pink-500 hover:bg-pink-600 focus:ring-4 focus:outline-none focus:ring-pink-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
      >
        Back
      </button>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="customerName" className="block text-gray-700">
            Customer Name
          </label>
          <input
            readOnly
            type="text"
            id="customerName"
            name="customerName"
            value={transactions.customerName}
            onChange={(e) =>
              setTransactions({ ...transactions, customerName: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg bg-white text-gray-700 cursor-not-allowed"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="customerAddress" className="block text-gray-700">
            Customer Address
          </label>
          <input
            readOnly
            type="text"
            id="customerAddress"
            name="customerAddress"
            value={transactions.customerAddress}
            onChange={(e) =>
              setTransactions({
                ...transactions,
                customerAddress: e.target.value,
              })
            }
            className="w-full px-3 py-2 border rounded-lg bg-white text-gray-700 cursor-not-allowed"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="transactionDate" className="block text-gray-700">
            Transaction Date
          </label>
          <input
            readOnly
            type="date"
            id="transactionDate"
            name="transactionDate"
            value={transactions.transactionDate}
            onChange={(e) =>
              setTransactions({
                ...transactions,
                transactionDate: e.target.value,
              })
            }
            className="w-full px-3 py-2 border rounded-lg bg-white text-gray-700 cursor-not-allowed"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="status" className="block text-gray-700">
            Status
          </label>
          <select
            disabled
            onChange={(e) =>
              setTransactions({ ...transactions, status: e.target.value })
            }
            name="status"
            value={transactions.status}
            className="w-full px-3 py-2 border rounded-lg bg-white text-gray-700 cursor-not-allowed"
          >
            <option value="belumbayar">Belum Bayar</option>
            <option value="dikemas">Dikemas</option>
            <option value="dikirim">Dikirim</option>
            <option value="selesai">Selesai</option>
            <option value="pengembalian">Pengembalian</option>
            <option value="dibatalkan">Dibatalkan</option>
          </select>
          {products.map((product) => (
            <div key={product._id} className="flex gap-4">
              <div>
                <label htmlFor="status" className="block text-gray-700">
                  Product Name
                </label>
                <input
                  readOnly
                  type="text"
                  id="status"
                  value={product.name}
                  className="w-full px-3 py-2 border rounded-lg bg-white text-gray-700 cursor-not-allowed"
                  required
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-gray-700">
                  Price (Rupiah)
                </label>
                <input
                  readOnly
                  type="text"
                  id="price"
                  value={product.price}
                  className="w-full px-3 py-2 border rounded-lg bg-white text-gray-700 cursor-not-allowed"
                  required
                />
              </div>
              <div>
                <label htmlFor="qty" className="block text-gray-700">
                  Quantity
                </label>
                <input
                  type="text"
                  id="qty"
                  value={product.qty}
                  onChange={(e) => {
                    const qty = parseInt(e.target.value || "0", 10);
                    setProducts(
                      products.map((s) =>
                        s._id === product._id ? { ...s, qty } : s
                      )
                    );
                  }}
                  className="w-full px-3 py-2 border rounded-lg bg-white text-gray-700"
                  required
                />
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-purple-500 text-white p-3 rounded"
        >
          Update Transaction
        </button>
      </form>
    </div>
  );
};

export default EditTransaction;
