"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const Home = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/outlets/profile");
        if (!response.ok) throw new Error("Failed to fetch user profile");
        const data = await response.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/outlets/transaction"); 
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        setOrders(data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      }
    };

    fetchUserProfile();
    fetchOrders();
  }, []);

  const pendingOrders = orders.filter((order: any) => order.status === "pending");

  if (loading) {
    return <div className="text-center text-pink-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white p-4 justify-between">
      <div className="flex-1">
        {/* Carousel */}
        <div className="p-4 mx-auto rounded-lg shadow-xl overflow-hidden">
          <div className="carousel w-full">
            <div id="item1" className="carousel-item w-full">
              <img
                src="https://storage.googleapis.com/gcs-cockpit-prod/uploads/image/asset/530/1694801288.jpeg"
                className="w-full object-cover"
              />
            </div>
            <div id="item2" className="carousel-item w-full">
              <img
                src="https://img.lazcdn.com/g/tps/imgextra/i1/O1CN012vmCIo1iWPdi3OrCA_!!6000000004420-0-tps-1976-688.jpg_2200x2200q80.jpg_.avif"
                className="w-full object-cover"
              />
            </div>
            <div id="item3" className="carousel-item w-full">
              <img
                src="https://img.lazcdn.com/g/tps/imgextra/i3/O1CN01wvw9i51Szh1uG1CkG_!!6000000002318-0-tps-1976-688.jpg_2200x2200q80.jpg_.avif"
                className="w-full object-cover"
              />
            </div>
            <div id="item4" className="carousel-item w-full">
              <img
                src="https://img.lazcdn.com/g/tps/imgextra/i4/O1CN01zGM6Sl1VO5R0r71Qa_!!6000000002642-0-tps-1976-688.jpg_2200x2200q80.jpg_.avif"
                className="w-full object-cover"
              />
            </div>
          </div>

          <div className="flex w-full justify-center gap-2 py-2">
            <a href="#item1" className="btn btn-xs text-pink-500 hover:text-pink-700 transition duration-300">
              1
            </a>
            <a href="#item2" className="btn btn-xs text-pink-500 hover:text-pink-700 transition duration-300">
              2
            </a>
            <a href="#item3" className="btn btn-xs text-pink-500 hover:text-pink-700 transition duration-300">
              3
            </a>
            <a href="#item4" className="btn btn-xs text-pink-500 hover:text-pink-700 transition duration-300">
              4
            </a>
          </div>
        </div>

        <div className="p-4">
          <span className="text-purple-600 font-bold text-xl">Status Pesanan</span>
          <div className="w-full p-4 bg-pink-100 rounded-lg shadow-md">
            <Link href="/outlet/transaction" className="flex justify-end px-2 text-purple-500 hover:text-purple-700 transition duration-300">
              see detail
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </Link>
            <div className="flex gap-6 justify-center mt-4">
              {["Perlu Dikirim", "Pembatalan", "Pengembalian"].map((status, index) => (
                <div
                  key={index}
                  className="flex flex-col justify-center items-center bg-purple-500 text-white text-xl md:w-40 md:h-40 sm:w-32 sm:h-32 rounded-xl shadow-lg transition-all hover:scale-105"
                >
                  <span>{pendingOrders.length}</span> {/* Menampilkan jumlah pesanan pending */}
                  <span>{status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <br />
        <div className="w-full p-4 bg-purple-100 rounded-lg shadow-md">
          <div className="flex gap-6 justify-center">
            {[{ href: "/outlet/product", label: "Produk", color: "bg-pink-400" },
            { href: "/finance", label: "Keuangan", color: "bg-purple-500" },
            { href: "/perform", label: "Performa toko", color: "bg-pink-400" },
            { href: "/helpDesk", label: "Bantuan", color: "bg-purple-500" }].map((menu, index) => (
              <Link href={menu.href} key={index}>
                <div className={`flex flex-col justify-center items-center ${menu.color} text-white text-xl md:w-40 md:h-40 sm:w-32 sm:h-32 rounded-xl shadow-lg transition-all hover:scale-105`}>
                  <span>{menu.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
