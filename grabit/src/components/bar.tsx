import Link from "next/link";

export default function Navbar() {
  return (
    <div className="bg-white-600 p-0 shadow-md">
      <div className="flex justify-between items-center px-6">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-purple-400 flex items-center">
          <img src="/1.png" alt="Logo" className="h-20 w-auto mr-4" />
          <span>GrabIt</span>
        </h1>
        {/* Menu */}
        <div className="space-x-4">
          <Link href="/">
            <button className="px-4 py-2 bg-purple-400 text-white rounded-lg shadow hover:bg-purple-500">
              Home
            </button>
          </Link>
          <Link href="/login">
            <button className="px-4 py-2 bg-purple-400 text-white rounded-lg shadow hover:bg-purple-500">
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
