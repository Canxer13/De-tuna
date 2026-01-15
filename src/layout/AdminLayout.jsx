import React from "react";
import { Outlet } from "react-router-dom";

// Layout ini hanya merender halaman admin
const AdminLayout = () => {
  return (
    <main>
      <Outlet />
    </main>
  );
};

export default AdminLayout;
