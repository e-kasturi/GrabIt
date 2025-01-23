"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2"; 

const UpdateProfile = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [outletName, setOutletName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`/api/outlets/profile`);
        if (!response.ok) throw new Error("Failed to fetch user profile");
        const data = await response.json();
        setUsers(data);
        if(data && data.length > 0) {
          const user = data[0];
          setEmail(user.email);
          setName(user.name);
          setOutletName(user.outletName);
          setAddress(user.address);
          setPhone(user.phone);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const profileData = {
      email,
      name,
      outletName,
      address,
      phone,
      password,
    };

    try {
      const response = await fetch("/api/outlets/profile/edit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (response.ok) {

        Swal.fire({
          title: "Success!",
          text: data.message,
          icon: "success",
          confirmButtonText: "Okay",
          confirmButtonColor: "#3085d6",
        }).then(() => {
          router.push("/outlet/profile");
        });
      } else {

        Swal.fire({
          title: "Error!",
          text: data.message,
          icon: "error",
          confirmButtonText: "Try Again",
          confirmButtonColor: "#d33",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An error occurred. Please try again.",
        icon: "error",
        confirmButtonText: "Try Again",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
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

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-teal-600">Update Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-4 py-3 border-2 border-teal-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-4 py-3 border-2 border-teal-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Leave blank to keep current password"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-4 py-3 border-2 border-teal-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name Outlet</label>
          <input
            type="text"
            value={outletName}
            onChange={(e) => setOutletName(e.target.value)}
            className="mt-1 block w-full px-4 py-3 border-2 border-teal-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 block w-full px-4 py-3 border-2 border-teal-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 block w-full px-4 py-3 border-2 border-teal-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>
        
        <div className="mb-6 text-center">
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
