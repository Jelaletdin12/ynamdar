import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/index";
import NavbarDown from "../Navbar/NavbarDown.jsx";
import Footer from "../Footer/index";

const Layout = () => {
  return (
    <>
      <Navbar />
      <NavbarDown/>
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
