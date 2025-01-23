"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const AddProducts = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [imgUrl, setImgUrl] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [tags, setTags] = useState("");
  const [stock, setStock] = useState("");
  const [customProduct, setCustomProduct] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [finalProductName, setFinalProductName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("Submitting new product:", {
      name,
      price,
      imgUrl,
      description,
      thumbnail,
      tags,
      stock,
    });

    const generatedSlug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "");

    const newProduct = {
      name: finalProductName,
      slug: generatedSlug,
      price: Number(price),
      imgUrl,
      description,
      thumbnail,
      tags: tags.split(",").map(tag => tag.trim()),
      stock: Number(stock),
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/outlets/produk`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      }
    );

    if (response.ok) {
      console.log("Product successfully added");
      Swal.fire({
        icon: "success",
        title: "Product Added",
        text: "The new product has been successfully added!",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      }).then(() => {
        router.push("/outlet/product");
        router.refresh();
      });
    } else {
      console.error("Failed to create product");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add product. Please try again later.",
        confirmButtonText: "OK",
        confirmButtonColor: "#1E3A8A",
      });
    }
  };

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

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? Number(e.target.value) : 0;
    setPrice(value);
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedProduct(e.target.value);
    if (e.target.value) {
      setFinalProductName(e.target.value);
    }
  };
  

  const handleCustomProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomProduct(e.target.value);
    setFinalProductName(e.target.value);
  };

  const handleImgUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImgUrl(e.target.value);
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-gradient-to-r from-teal-500 to-teal-400">
      <div className="w-full max-w-lg p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Add New Product
        </h2>
        <button
          onClick={() => {
            router.back();
            router.refresh();
          }}
          className="mb-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Back
        </button>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Product Name</label>
          <input
            type="text"
            value={selectedProduct}
            onChange={handleProductChange}
            className="mt-1 block w-full px-4 py-3 border-2 border-teal-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
            placeholder="Enter Name Product"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Stock</label>
          <input
            type="text"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="mt-1 block w-full px-4 py-3 border-2 border-teal-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
            placeholder="Enter Stock Product"
          />
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="tags"
              className="block text-lg font-medium text-gray-700"
            >
              Ketegori
            </label>
            <select
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Select a Tags</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Elektronik">Elektronik</option>
              <option value="Aksesoris">Aksesoris</option>
              <option value="Other">Other</option>
            </select>

            {selectedProduct === "Other" && (
              <input
                type="text"
                value={customProduct}
                onChange={handleCustomProductChange}
                className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter custom product tags"
              />
            )}
          </div>

          {/* Description Section */}
          <div>
            <label
              htmlFor="description"
              className="block text-lg font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Describe the product"
            />
          </div>

          {/* Price Section */}
          <div>
            <label
              htmlFor="price"
              className="block text-lg font-medium text-gray-700"
            >
              Price (Rupiah)
            </label>
            <input
              type="text"
              id="price"
              value={price}
              onChange={handlePriceChange}
              required
              className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter price"
            />
          </div>

          {/* Image URL Section */}
          <div>
            <label
              htmlFor="imgUrl"
              className="block text-lg font-medium text-gray-700"
            >
              Foto Product
            </label>
            <input
              type="text"
              id="imgUrl"
              value={imgUrl}
              onChange={handleImgUrl}
              required
              className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter image URL"
            />
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full py-3 bg-teal-500 text-white rounded-lg shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-300"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProducts;
