"use client";

import { handleLogout } from "@/actions";

export default function LogoutButton() {
  return (
    <button
      onClick={async () => {
        await handleLogout();
        window.location.href = "/login?refresh=true";
      }}
      className="px-4 py-2 bg-white text-teal-500 rounded-lg shadow hover:bg-gray-100"
    >
      Logout
    </button>
  );
}
