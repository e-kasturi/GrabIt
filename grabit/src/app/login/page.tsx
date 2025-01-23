'use client'
import Link from "next/link";
import { useState } from "react";
import Swal from "sweetalert2";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ email, password, role: "admin" })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("access_token", data.access_token);
        await Swal.fire({
          title: "Login Berhasil!",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        window.location.href = "/home";
      } else {
        await Swal.fire({
          title: "Login Gagal",
          text: data.message || "Login gagal. Silakan coba lagi.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      await Swal.fire({
        title: "Terjadi Kesalahan",
        text: "Tidak dapat memproses login. Silakan coba lagi nanti.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
        <div className="max-w-md w-full">
          <div className="p-8 rounded-l bg-pink-50 shadow-md">
            <h2 className="text-gray-800 text-center text-2xl font-bold">
              Login
            </h2>
            <form onSubmit={handleLogin} className="mt-8 space-y-4">
              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Email
                </label>
                <div className="relative flex items-center">
                  <input
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="text"
                    required
                    className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-purple-600"
                    placeholder="Enter user name"
                  />
                </div>
              </div>
              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Password
                </label>
                <div className="relative flex items-center">
                  <input
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    required
                    className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-purple-600"
                    placeholder="Enter password"
                  />
                </div>
              </div>
              <div className="flex justify-center !mt-8">
                <button
                  type="submit"
                  className="w-80 py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-pink-600 hover:bg-pink-700 focus:outline-none"
                  disabled={loading}>
                  {loading ? (
                    <div className="flex justify-center">
                      <div className="spinner-border animate-spin border-4 border-teal-600 rounded-full w-6 h-6 mr-2" />
                      <span>Please Wait...</span>
                    </div>
                  ) : ("Login")}
                </button>
              </div>

              <p className="text-gray-500 text-sm text-center">
                Don't have an account?
                <Link href="/register"
                  className="text-purple-600 font-semibold hover:underline ml-1"
                >
                  Register
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
