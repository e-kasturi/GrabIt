"use client";

import { useEffect, useState } from "react";
import { productType } from "@/type";
import Link from "next/link";
import Swal from "sweetalert2";

const ProductsPage = () => {
  const [products, setProducts] = useState<productType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/outlets/produk");
        if (!response.ok) throw new Error("Failed to fetch produk");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (slug: string) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirmed.isConfirmed) return;

    try {
      const response = await fetch(`/api/outlets/produk/${slug}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete product");

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.slug !== slug)
      );

      Swal.fire({
        title: "Deleted!",
        text: "Your service has been deleted.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      });
    } catch (err) {
      Swal.fire(
        "Error",
        err instanceof Error ? err.message : "An unknown error occurred",
        "error"
      );
    }
  };

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
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="products-page py-12 px-6 bg-pink-100 mt-16"> {/* Tambahkan margin top */}
      <h2 className="text-3xl font-semibold text-center text-pink-600 mb-8">
        Products List
      </h2>

      <div className="flex justify-between items-center mb-8">
        <Link href={"/outlet/product/add"}>
          <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-300">
            + Add Products
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            key={product.slug}
            className="service-card bg-white shadow-xl rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="flex items-center px-4">
              <img
                src={product.imgUrl}
                className="w-32 h-32 rounded-md"
                alt={product.name}
              />
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-semibold text-purple-800 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Stock: {product.stock}
                </p>
                <p className="text-gray-600 text-sm mb-4">
                  Price: Rp.{product.price.toLocaleString()}
                </p>

                {product.outletDetails && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-700 font-semibold">
                      Outlet Details:
                    </p>
                    <p className="text-sm text-gray-600">
                      Name Outlet: {product.outletDetails.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Phone: {product.outletDetails.phone}
                    </p>
                    <p className="text-sm text-gray-600">
                      Email: {product.outletDetails.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      Address: {product.outletDetails.address}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 flex justify-between items-center border-t border-gray-200">
              <Link
                href={`/outlet/product/edit/${product.slug}`}
                className="text-purple-600 hover:text-purple-800 font-medium"
              >
                Edit
              </Link>

              <button
                onClick={() => handleDelete(product.slug)}
                className="text-pink-600 hover:text-pink-800 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
