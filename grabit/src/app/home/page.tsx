"use client"
import Link from "next/link";
import { useEffect, useState } from "react";

const Home = () => {
  const [users, setUsers] = useState<any[]>([]);
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

    fetchUserProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="h-screen w-screen p-4 justify-center">
     

      {/* Carousel */}
      <div className="p-4 mx-auto">
        <div className="carousel w-full">
          <div id="item1" className="carousel-item w-full">
            <img
              src="https://storage.googleapis.com/gcs-cockpit-prod/uploads/image/asset/530/1694801288.jpeg"
              className="w-full"
            />
          </div>
          <div id="item2" className="carousel-item w-full">
            <img
              src="https://img.lazcdn.com/g/tps/imgextra/i1/O1CN012vmCIo1iWPdi3OrCA_!!6000000004420-0-tps-1976-688.jpg_2200x2200q80.jpg_.avif"
              className="w-full"
            />
          </div>
          <div id="item3" className="carousel-item w-full">
            <img
              src="https://img.lazcdn.com/g/tps/imgextra/i3/O1CN01wvw9i51Szh1uG1CkG_!!6000000002318-0-tps-1976-688.jpg_2200x2200q80.jpg_.avif"
              className="w-full"
            />
          </div>
          <div id="item4" className="carousel-item w-full">
            <img src="https://img.lazcdn.com/g/tps/imgextra/i4/O1CN01zGM6Sl1VO5R0r71Qa_!!6000000002642-0-tps-1976-688.jpg_2200x2200q80.jpg_.avif" 
            className="w-full" />
          </div>
        </div>

        <div className="flex w-full justify-center gap-2 py-2">
          <a href="#item1" className="btn btn-xs">
            1
          </a>
          <a href="#item2" className="btn btn-xs">
            2
          </a>
          <a href="#item3" className="btn btn-xs">
            3
          </a>
          <a href="#item4" className="btn btn-xs">
            4
          </a>
        </div>
      </div>

      <div className="p-4">
        <span>Status Pesanan</span>
        <div className="w-full p-2 bg-[#E4FBFF]">
          <Link href="/order" className="flex justify-end px-2">
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
          <div className="flex gap-6 justify-center">
            {["Perlu Dikirim", "Pembatalan", "Pengembalian"].map(
              (status, index) => (
                <div
                  key={index}
                  className="flex flex-col justify-center items-center bg-[#04A8C1] text-white text-xl md:w-40 md:h-40 sm:w-32 sm:h-32"
                >
                  <span>0</span>
                  <span>{status}</span>
                </div>
              )
            )}
          </div>
        </div>

        <br />
        <div className="w-full p-4 bg-[#E4FBFF]">
          <div className="flex gap-6 justify-center">
            {[
              { href: "/product", label: "Produk" },
              { href: "/finance", label: "Keuangan" },
              { href: "/perform", label: "Performa toko" },
              { href: "/helpDesk", label: "Bantuan" },
            ].map((menu, index) => (
              <Link href={menu.href} key={index}>
                <div className="flex flex-col justify-center items-center bg-[#04A8C1] text-white text-xl md:w-40 md:h-40 sm:w-32 sm:h-32">
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
