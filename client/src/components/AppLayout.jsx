import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

export default function AppLayout() {
  const location = useLocation();

  // صفحات بدون Navbar
  const hideNavbar =
    location.pathname === "/" || location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Outlet />
    </>
  );
}
