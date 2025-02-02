"use client";
import { useEffect, useState } from "react";

export default function Finance() {
  const [balance, setBalance] = useState<number | null>(null);
  const [withdrawn, setWithdrawn] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        const balanceResponse = await fetch("/api/outlets/balances", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!balanceResponse.ok) throw new Error("Failed to fetch balance");

        const balanceData = await balanceResponse.json();
        setBalance(balanceData[0].balance);
        console.log("Balance data:", balanceData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchFinanceData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="w-screen h-screen bg-pink-50 pt-20 flex flex-col items-center">
      {/* Section Total */}
      <div className="mt-6 bg-white w-3/4 h-36 p-10 rounded-lg shadow-lg flex flex-col items-center justify-center">
        <span className="text-lg lg:text-xl font-medium text-purple-700">Total:</span>
        <span className="text-xl lg:text-2xl font-semibold text-pink-600">
        {balance !== null
                      ? `Rp ${balance.toLocaleString()}`
                      : "Loading..."}
        </span>
      </div>

      {/* Section Balance and Withdraw */}
      <div className="flex justify-center mt-10 space-x-12 w-full">
        {/* Total Balance */}
        <div className="bg-white w-1/3 h-42 p-10 rounded-lg shadow-lg flex flex-col items-center justify-between">
          <span className="text-lg lg:text-xl font-semibold text-purple-700">Total Saldo:</span>
          <span className="text-xl lg:text-2xl text-pink-600">
            Rp {balance?.toLocaleString()}
          </span>
        </div>

        {/* Withdrawn */}
        <div className="bg-white w-1/3 h-36 p-10 rounded-lg shadow-lg flex flex-col items-center justify-between">
          <span className="text-lg lg:text-xl font-semibold text-purple-700">Ditarik:</span>
          <span className="text-xl lg:text-2xl text-pink-600">
            Rp {withdrawn?.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
