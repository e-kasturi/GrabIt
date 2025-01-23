"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const UserProfile = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("/api/outlets/profile");
        if (!response.ok) throw new Error("Failed to fetch user profile");
        const data = await response.json();
        setUsers(data);
        console.log(data);

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

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
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

  if (error) {
    return <div className="text-center py-6 text-xl text-red-600">{error}</div>;
  }

  return (
    <>
      <div className="bg-gradient-to-r from-pink-200 to-purple-200 min-h-screen flex justify-center items-center">
        <div className="max-w-3xl w-full bg-white rounded-xl shadow-xl overflow-hidden relative p-8">
          {users.length > 0 && (
            <>
              <div className="flex justify-center mb-8">
                <div className="w-32 h-32 border-4 border-white rounded-full overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out">
                  <img
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="text-center mb-8">
                <div className="text-2xl font-semibold text-pink-600">
                  {users[0].name}
                </div>
                <div className="text-lg text-purple-500">
                  {users[0].nameOutlet}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-white shadow-lg rounded-lg p-6">
                  <div className="text-sm font-medium text-purple-500">Balance:</div>
                  <div className="text-xl font-semibold text-pink-600">
                    {balance !== null
                      ? `Rp ${balance.toLocaleString()}`
                      : "Loading..."}
                  </div>
                </div>

                <div className="bg-white shadow-lg rounded-lg p-6">
                  <div className="text-sm font-medium text-purple-500">Email:</div>
                  <div className="text-lg text-gray-800">{users[0].email}</div>
                </div>

                <div className="bg-white shadow-lg rounded-lg p-6">
                  <div className="text-sm font-medium text-purple-500">Phone:</div>
                  <div className="text-lg text-gray-800">{users[0].phone}</div>
                </div>

                <div className="bg-white shadow-lg rounded-lg p-6">
                  <div className="text-sm font-medium text-purple-500">Address:</div>
                  <div className="text-lg text-gray-800">{users[0].address}</div>
                </div>
              </div>

              <div className="flex justify-center">
                <Link href="/outlet/profile/editprofile">
                  <button className="px-8 py-3 bg-pink-600 text-white text-base rounded-full shadow-md hover:bg-pink-700 transform hover:scale-105 transition-all duration-300 ease-in-out">
                    Edit Profile
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfile;
