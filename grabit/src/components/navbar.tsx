"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import LogoutButton from "../components/logout";

export default function Navbar() {

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/home" className="flex items-center text-3xl font-bold text-purple-500">
          <img src="/1.png" alt="Logo" className="h-16 w-auto mr-2" /> {/* Logo */}
          GrabIt
        </Link>

        <div className="space-x-4">
          <Link href="/outlet/profile">
            <button className="px-4 py-2 bg-white text-purple-500 rounded-lg shadow hover:bg-pink-500 hover:text-white">
              Profile
            </button>
          </Link>
          <Link href="/outlet/product">
            <button className="px-4 py-2 bg-white text-purple-500 rounded-lg shadow hover:bg-pink-500 hover:text-white">
              Products
            </button>
          </Link>
          <Link href="/outlet/transaction">
            <button className="px-4 py-2 bg-white text-purple-500 rounded-lg shadow hover:bg-pink-500 hover:text-white">
              Transaction
            </button>
          </Link>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
