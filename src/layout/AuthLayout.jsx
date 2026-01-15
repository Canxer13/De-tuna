import React from "react";
import { Outlet } from "react-router-dom";

// Layout ini hanya merender halaman (Login/Register) tanpa Navbar/Footer
const AuthLayout = () => {
  return (
    <main>
      <Outlet />
    </main>
  );
};

export default AuthLayout;
