"use client";

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { ChangeEvent, FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [latitude, setLatitude] = useState<number>(-6.2);
  const [longitude, setLongitude] = useState<number>(106.816666);
  const [user, setUser] = useState({
    name: "",
    outletName: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    role: "admin",
  });
  const router = useRouter();

  const handleChange = (element: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = element.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/register`,
        {
          method: "POST",
          headers: {
            "content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );

      const response = await res.json();
      if (!res.ok) {
        throw new Error(response.message || "Register Failed");
      }
      alert("Registration Success");
      router.push("/login");
      
    } catch (error: any) {
      setErrorMessage(error.message || "Register Failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="font-[sans-serif] bg-[#E4FBFF] md:h-screen">
    <div className="grid md:grid-cols-2 items-center gap-8 h-full">
      {errorMessage && (
        <p className="mb-4 text-center text-sm text-red-600">{errorMessage}</p>
      )}
  
      {/* Left Form Section */}
      <div className="p-6 flex items-center">
        <form onSubmit={handleSubmit} className="max-w-lg w-full mx-auto">
          <div className="mb-8">
            <h3 className="text-[#223537] text-2xl font-bold text-center">
              Register Your Account
            </h3>
          </div>
          <div className="space-y-4">
            {/* Outlet Name and Full Name Fields */}
 
              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Outlet Name
                </label>
                <input
                  name="outletName"
                  value={user.outletName}
                  onChange={handleChange}
                  type="text"
                  required
                  className="bg-white border border-gray-300 w-full text-sm text-gray-800 pl-4 py-2.5 rounded-md outline-blue-500"
                  placeholder="Enter outlet name"
                />
              </div>
              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Full Name
                </label>
                <input
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  type="text"
                  required
                  className="bg-white border border-gray-300 w-full text-sm text-gray-800 pl-4 py-2.5 rounded-md outline-blue-500"
                  placeholder="Enter name"
                />
            </div>
  
            {/* Phone */}
            <div>
              <label className="text-gray-800 text-sm mb-2 block">Phone</label>
              <input
                name="phone"
                value={user.phone}
                onChange={handleChange}
                type="number"
                required
                className="bg-white border border-gray-300 w-full text-sm text-gray-800 pl-4 py-2.5 rounded-md outline-blue-500"
                placeholder="Enter phone number"
              />
            </div>
  
            {/* Email */}
            <div>
              <label className="text-gray-800 text-sm mb-2 block">Email</label>
              <input
                name="email"
                value={user.email}
                onChange={handleChange}
                type="email"
                required
                className="bg-white border border-gray-300 w-full text-sm text-gray-800 pl-4 py-2.5 rounded-md outline-blue-500"
                placeholder="Enter email"
              />
            </div>
  
            {/* Password */}
            <div>
              <label className="text-gray-800 text-sm mb-2 block">Password</label>
              <input
                name="password"
                value={user.password}
                onChange={handleChange}
                type="password"
                required
                className="bg-white border border-gray-300 w-full text-sm text-gray-800 pl-4 py-2.5 rounded-md outline-blue-500"
                placeholder="Enter password"
              />
            </div>
          </div>
        </form>
      </div>
  
      {/* Right Form Section */}
      <div className="flex items-center p-6 h-full w-full">
        <form className="max-w-lg w-full mx-auto">
          {/* Address Field */}
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                id="address"
                value={user.address}
                onChange={handleChange}
                name="address"
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Address"
                required
              />
            </div>
  
            {/* Select Location */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Select Location on Map
              </label>
              <div className="w-full h-64 rounded-lg shadow-lg border">
                <LoadScript
                  googleMapsApiKey={
                    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
                  }
                >
                  <GoogleMap
                    mapContainerStyle={{ height: "100%", width: "100%" }}
                    center={{ lat: latitude, lng: longitude }}
                    zoom={13}
                    onClick={(e: any) => {
                      if (e.latLng) {
                        setLatitude(e.latLng.lat());
                        setLongitude(e.latLng.lng());
                      }
                    }}
                  >
                    <Marker position={{ lat: latitude, lng: longitude }} />
                  </GoogleMap>
                </LoadScript>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Latitude: {latitude}, Longitude: {longitude}
              </p>
            </div>
          </div>
  
          {/* Center the Button */}
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              className="w-80 py-2.5 px-4 text-sm tracking-wider rounded-md bg-[#04A8C1] hover:bg-[#00869A] text-white focus:outline-none"
            >
              Create Account
            </button>
          </div>
  
          {/* Center the Text */}
          <p className="text-gray-800 text-sm mt-4 text-center">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#04A8C1] font-semibold hover:underline ml-1"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  </div>
  )  
};
export default Register;
