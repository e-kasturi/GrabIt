"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [latitude, setLatitude] = useState<number>(-6.2);
  const [longitude, setLongitude] = useState<number>(106.816666);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        name: formData.get("name"),
        namaOutlet: formData.get("namaOutlet"),
        email: formData.get("email"),
        password: formData.get("password"),
        phone: formData.get("phone"),
        address: formData.get("address"),
        latitude,
        longitude,
      };
  
    
  
      setLoading(true);
      setErrorMessage("");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, role: "admin" }),
      });
  
      const response = await res.json();
      if (!res.ok) {
        throw new Error(response.message || "Failed to register.");
      }
  
      alert("Registration successful!");
      router.push("/login");
    } catch (error: any) {
      setErrorMessage(error.errors?.[0]?.message || error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex min-h-screen bg-teal-500 overflow-hidden">
      <div className="flex flex-1 items-center justify-center py-16 px-8">
        <div className="flex flex-col items-center justify-center space-y-8 md:space-y-0 md:flex-row md:space-x-12 w-full max-w-7xl">
          <div className="flex-shrink-0 md:w-1/3 w-1/2 text-center">
            <img
              src="/CleanCuan.png"
              alt="Logo"
              className="w-full h-auto object-contain md:h-[8rem]"
            />
            <h2 className="text-3xl text-white font-bold mt-4">
              "Register Your Laundry with Clean Cuan!"
            </h2>
          </div>

          {/* Form Section */}
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg mx-auto md:w-1/3 mt-8 mb-8">
            <h2 className="text-2xl font-bold text-center text-teal-600 mb-6">
              Create an Account
            </h2>
            {errorMessage && (
              <p className="mb-4 text-center text-sm text-red-600">
                {errorMessage}
              </p>
            )}

            <form onSubmit={handleRegister} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { id: "name", label: "Name Outlet", type: "text" },
                  { id: "namaOutlet", label: "Name", type: "text" },
                  { id: "email", label: "Email", type: "email" },
                  { id: "password", label: "Password", type: "password" },
                  { id: "phone", label: "Phone", type: "tel" },
                ].map(({ id, label, type }) => (
                  <div key={id} className="w-full">
                    <label
                      htmlFor={id}
                      className="block text-sm font-medium text-gray-700"
                    >
                      {label}
                    </label>
                    {type === "textarea" ? (
                      <textarea
                        id={id}
                        name={id}
                        className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder={label}
                        required
                      />
                    ) : (
                      <input
                        id={id}
                        name={id}
                        type={type}
                        className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder={label}
                        required
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Address and Google Map Section */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Address"
                  required

                />
              </div>
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

              <button
                type="submit"
                className="w-full py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-300"
                disabled={loading}
              >
                {loading ? "Processing..." : "Register Account"}
              </button>
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link href="/login" className="text-teal-600 hover:underline">
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
