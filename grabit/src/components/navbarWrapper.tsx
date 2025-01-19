"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";

const NavbarWrapper = () => {
  const pathname = usePathname();

  const showNavbar = ["/order", "/order/done", "/order/canceled", "/order/sent"].includes(pathname);

  return showNavbar ? <Navbar /> : null;
};

export default NavbarWrapper;
