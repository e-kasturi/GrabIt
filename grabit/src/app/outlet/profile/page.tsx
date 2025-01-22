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
          className="animate-spin h-16 w-16 text-blue-400"
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
      <div className="bg-[#E4FBFF] min-h-screen flex justify-center items-center">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden relative pt-24 px-8">
          {users.length > 0 && (
            <>
              <div className="absolute top-[-60px] left-1/2 transform -translate-x-1/2">
                <div className="w-32 h-32 border-4 border-white rounded-full overflow-hidden shadow-lg hover:scale-105 transition-all duration-300 ease-in-out">
                  <img
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="pb-10 text-center">
                <div className="mt-6 flex justify-center items-center">
                  <div className="relative w-20 h-20">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path
                        className="text-gray-300"
                        strokeWidth="3"
                        fill="none"
                        d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      ></path>
                      <path
                        className="text-yellow-400"
                        strokeDasharray="85, 100"
                        strokeWidth="3"
                        fill="none"
                        d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      ></path>
                    </svg>
                    <div className="absolute inset-0 flex justify-center items-center text-sm font-bold text-gray-800"></div>
                  </div>
                </div>

                <div className="mt-10 text-left space-y-6">
                  {users.map((user) => (
                    <div
                      key={user.name}
                      className="bg-white shadow-md rounded-lg p-6 transform hover:scale-105 transition-all duration-300 ease-in-out"
                    >
                      <div className="mb-4">
                        <span className="text-base font-medium text-gray-600">
                          Name:
                        </span>
                        <span className="text-base text-gray-900 ml-2">
                          {user.name}
                        </span>
                      </div>
                      <div className="mb-4">
                        <span className="text-base font-medium text-gray-600">
                          Balance:
                        </span>
                        <span className="text-base text-gray-900 ml-2">
                          {balance !== null
                            ? `Rp ${balance.toLocaleString()}`
                            : "Loading..."}
                        </span>
                      </div>
                      <div className="mb-4">
                        <span className="text-base font-medium text-gray-600">
                          Name Outlet:
                        </span>
                        <span className="text-base text-gray-900 ml-2">
                          {user.nameOutlet}
                        </span>
                      </div>
                      <div className="mb-4">
                        <span className="text-base font-medium text-gray-600">
                          Email Address:
                        </span>
                        <span className="text-base text-gray-900 ml-2">
                          {user.email}
                        </span>
                      </div>
                      <div className="mb-4">
                        <span className="text-base font-medium text-gray-600">
                          Phone Number:
                        </span>
                        <span className="text-base text-gray-900 ml-2">
                          {user.phone}
                        </span>
                      </div>
                      <div className="mb-4">
                        <span className="text-base font-medium text-gray-600">
                          Address:
                        </span>
                        <span className="text-base text-gray-900 ml-2">
                          {user.address}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex justify-center">
                  <Link href="/outlet/profile/editprofile">
                    <button className="px-6 py-3 bg-white text-teal-600 text-base rounded-full shadow-md hover:bg-teal-100 transform hover:scale-105 transition-all duration-300 ease-in-out">
                      Edit Profile
                    </button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfile;
