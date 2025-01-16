"use client";

import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, use, useState } from "react";
import Link from "next/link";


const Register = () => {
  const router = useRouter()
  const [loadeing, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [latitude, setLatitude] = useState<number>(-6.2);
  const [longitude, setLongitude] = useState<number>(106.816666);
  const [user, setUser] = useState({
    name: "",
    outletName: "",
    email: "",
    password: "",
    address: "",
    role: "admin",
  });


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

      if (res.ok) {
        alert("Registration Success");
        router.push("/login");
      }
    } catch (error) {
      alert(error || "Register Failed");
      //throw new Error(response.message || "Register Failed")
    }
  };

  return (
    <div className="font-[sans-serif] bg-[#E4FBFF]  md:h-screen">
      <div className="grid md:grid-cols-2 items-center gap-8 h-full">
        {/**Error Message */}
        {error && (
          <p className="mb-4 text-center text-sm text-red-600">{error}</p>
        )}

        {/* Left Image Section */}
        <div className="p-4 bg-gray-50 h-full hidden lg:block">
          <img
            src="https://readymadeui.com/signin-image.webp"
            className="max-w-[80%] w-full h-full aspect-square object-contain block mx-auto"
            alt="login-image"
          />
        </div>

        {/* Right Form Section */}
        <div
          onSubmit={handleSubmit}
          className="flex items-center p-6 h-full w-full"
        >
          <form className="max-w-lg w-full mx-auto">
            <div className="mb-8">
              <h3 className="text-[#223537] text-2xl font-bold text-center">
                Register You're Accoount
              </h3>
            </div>
            <div className="space-y-4">
              {/**outlet name */}
              <div className="flex w-full gap-4">
                <div className="flex-1">
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
                {/**Name/ full name */}
                <div className="flex-1">
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
              </div>
              {/**Email */}
              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Email
                </label>
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
              {/**Password */}
              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Password
                </label>
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
              {/**addres */}
              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Address
                </label>
                <textarea
                  name="address"
                  value={user.address}
                  onChange={handleChange}
                  type="text"
                  required
                  className="bg-white border border-gray-300 w-full text-sm text-gray-800 pl-4 py-2.5 rounded-md outline-blue-500"
                  placeholder="Enter address"
                />
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
              <Link   href="/login"
                className="text-[#04A8C1] font-semibold hover:underline ml-1"
           >
                Login
              </Link>
            
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Register;
