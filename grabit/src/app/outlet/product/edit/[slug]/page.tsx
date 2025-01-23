"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";

const EditProduct = () => {
  const router = useRouter();
  const { slug } = useParams();
  const [product, setProduct] = useState({
    name: "",
    slug: "",
    price: 0,
    stock: 0,
    description: "",
    outletId: "",
    outletDetails: {
      name: "",
      picName: "",
      picPhone: "",
      email: "",
      address: "",
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const outletId = Cookies.get("outletId");
    if (outletId) {
      setProduct((prevProduct) => ({
        ...prevProduct,
        outletId: outletId,
      }));
    }

    if (slug) {
      setLoading(true);
      console.log("Fetching product for slug:", slug);
      fetch(`/api/outlets/produk/${slug}`)
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setProduct(data);
          }
        })
        .catch((err) => {
          setError("Error fetching product data.");
          console.error("Error fetching product:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [slug]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "stock" || name === "price") {
      const numericValue = value ? parseFloat(value) : 0;
      setProduct((prevProduct) => ({
        ...prevProduct,
        [name]: numericValue,
      }));
    } else {
      setProduct((prevProduct) => ({
        ...prevProduct,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, outletId, stock, price, description } = product;

    if (!name || !stock || !price || !outletId || !description) {
      setError("All fields are required!");
      return;
    }

    if (isNaN(stock) || isNaN(price)) {
      setError("Duration and Price must be valid numbers.");
      return;
    }

    const updatedProductData = {
      name,
      outletId,
      stock,
      description,
      price,
    };

    console.log("Updated produk data before sending:", updatedProductData);

    try {
      const response = await fetch(`/api/outlets/produk/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProductData),
      });

      const responseData = await response.json();

      if (response.ok) {
        router.push(`/outlet/product`);
      } else {
        console.error("Server error:", responseData);
        setError(responseData.message || "Failed to update product.");
      }
    } catch (err) {
      console.error("Network error:", err);
      setError("An error occurred while updating the product.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <svg
          className="animate-spin h-10 w-10 text-purple-500"
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
    <div className="max-w-4xl mx-auto p-8 mt-20 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold text-purple-800 mb-4">
        Edit Product
      </h1>

      {error && <div className="text-pink-500 mb-4">{error}</div>}

      <button
        onClick={() => {
          router.back();
          router.refresh();
        }}
        className="mb-4 text-white bg-pink-600 hover:bg-pink-700 focus:ring-4 focus:outline-none focus:ring-pink-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
      >
        Back
      </button>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={product.name}
            onChange={handleChange}
            className="mt-2 w-full p-3 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700">
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={product.description}
            onChange={handleChange}
            className="mt-2 w-full p-3 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="stock" className="block text-gray-700">
            Stock
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            className="mt-2 w-full p-3 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="price" className="block text-gray-700">
            Price (IDR)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={product.price}
            onChange={handleChange}
            className="mt-2 w-full p-3 border border-gray-300 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
