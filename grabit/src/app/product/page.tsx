"use client"; // Menandai komponen sebagai Client Component

import { useState } from "react";

export default function Product() {
  const [filter, setFilter] = useState("latest");

  const products = [
    { id: 1, title: "Product A", date: "2023-01-15", description: "ipsum lerem blablabla", price: "Rp.30.000" },
    { id: 2, title: "Product B", date: "2023-05-10", description: "ipsum lerem blablabla", price: "Rp.30.000" },
    { id: 3, title: "Product C", date: "2022-12-25", description: "ipsum lerem blablabla", price: "Rp.30.000" },
  ];

  const sortedProducts =
    filter === "latest"
      ? [...products].sort((a, b) => new Date(b.date) - new Date(a.date))
      : [...products].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="h-screen w-screen p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <span className="text-lg font-semibold">Product</span>
          <span className="badge bg-error badge-sm indicator-item">3</span>
        </div>

        {/* Search Bar */}
        <div className="form-control w-full md:w-6/12">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-full"
          />
        </div>

        {/* Dropdown Filter */}
        <div>
          <details className="dropdown">
            <summary className="btn btn-outline m-1">Filter</summary>
            <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
              <li>
                <button onClick={() => setFilter("latest")}>Terbaru</button>
              </li>
              <li>
                <button onClick={() => setFilter("oldest")}>Terlama</button>
              </li>
            </ul>
          </details>
        </div>
      </div>

      {/* Product Cards */}
      <div className="space-y-4">
        {sortedProducts.map((product) => (
          <div key={product.id} className="card card-side bg-base-100 shadow-xl">
            <figure>
              <img
                src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
                alt={product.title}
                className="w-full h-auto"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{product.title}</h2>
              <h2 className="card-description">{product.description}</h2>
              <h2 className="card-price">{product.price}</h2>
              <p>Release Date: {product.date}</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Edit</button>
                <button className="btn btn-error">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
