'use client' // Marking this component as a client component

import { useRouter } from "next/navigation"; // Use next/navigation for router in client components
import { useState, useEffect } from "react";

export default function Order() {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState("waiting");

  useEffect(() => {
    if (router.query && router.query.status) {
      setCurrentStatus(router.query.status as string); // Update state if query has status
    }
  }, [router.query]);

  return (
    <div className="p-4">
      {/* Main Card for Buyer Info */}
      <div className="card card-side bg-error shadow-xl p-6 space-y-6">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold">Nama Pembeli:</p>
              <p>John Doe</p>
            </div>
            <div className="flex items-center space-x-2">
              <p className="font-bold">Status:</p>
              <p className="font-semibold">
                {currentStatus === "waiting" && "Waiting List"}
                {currentStatus === "sent" && "Sent"}
                {currentStatus === "done" && "Done"}
                {currentStatus === "canceled" && "Canceled"}
              </p>
            </div>
          </div>

          {/* Detail Buyer Info */}
          <div className="mt-4">
            <p className="font-bold">Nomor Telepon:</p>
            <p>0812-3456-7890</p>
          </div>
          <div className="mt-4">
            <p className="font-bold">Alamat Pembeli:</p>
            <p>Jl. Mawar No. 123, Jakarta</p>
          </div>

          {/* Product Card */}
          <div className="card card-side bg-base-100 shadow-xl mt-6">
            <figure>
              <img
                src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
                alt="Product"
                className="w-32 h-auto object-cover"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">Baju Cantik</h2>
              <p className="card-description">Baju modis yang cocok untuk semua acara</p>
              <p className="card-price">Rp.30.000</p>
            </div>
          </div>

          {/* Show Status Based on Selection */}
          {currentStatus === "waiting" && <div className="mt-4 text-yellow-500">
            orders need to be sent</div>}
          {currentStatus === "sent" && <div className="mt-4 text-blue-500">Your order has been sent.</div>}
          {currentStatus === "done" && <div className="mt-4 text-green-500">Your order is completed.</div>}
          {currentStatus === "canceled" && <div className="mt-4 text-red-500">Your order has been canceled.</div>}

          <div className="mt-6 flex justify-end">
            {currentStatus !== "done" && currentStatus !== "canceled" && (
              <button className="btn btn-primary">Batalkan</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
