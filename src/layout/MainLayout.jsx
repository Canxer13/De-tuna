import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        {/* Halaman (Home, About, dll) akan dirender di sini */}
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
