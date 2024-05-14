import React from "react";
import { Sidebar } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import AppLogo from "../assets/logo.png";
import HeaderProfile from "./HeaderProfile";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

export default function AppSidebar() {
  const path = useLocation().pathname;

  const handleSidebarMenu = () => {
    const sidebar = document.getElementById("app-sidebar");
    const sidebarclose = document.getElementById("sidebar-menu-close");
    sidebar.style.display = "block";
    sidebarclose.style.display = "block";
    sidebar.style.boxShadow =
      "0 4px 8px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.5)";
  };

  const handleSidebarMenuClose = () => {
    const sidebar = document.getElementById("app-sidebar");
    const sidebarclose = document.getElementById("sidebar-menu-close");
    sidebar.style.display = "none";
    sidebarclose.style.display = "none";
    sidebar.style.boxShadow = "0";
  };

  window.addEventListener("resize", () => {
    const sidebar = document.getElementById("app-sidebar");
    const sidebarclose = document.getElementById("sidebar-menu-close");
    if (window.innerWidth > 930) {
      sidebar.style.display = "block";
      sidebarclose.style.display = "none";
      sidebar.style.boxShadow = "none";
    } else {
      sidebar.style.display = "none";
      sidebarclose.style.display = "none";
      sidebar.style.boxShadow = "none";
    }
  });

  return (
    <>
      <AiOutlineMenu
        id="sidebar-menu"
        className="sidebar-menu hidden fixed size-8 m-2 p-1 z-10 text-cbrown bg-clight rounded cshadow hover:cursor-pointer"
        onClick={handleSidebarMenu}
      />
      <AiOutlineClose
        id="sidebar-menu-close"
        className="sidebar-menu-close fixed left-[215px] hidden size-8 m-2 p-1 z-20 text-cbrown bg-clight rounded cshadow hover:cursor-pointer"
        onClick={handleSidebarMenuClose}
      />
      <Sidebar
        id="app-sidebar"
        className="app-sidebar h-screen w-60 fixed z-10"
      >
        <Sidebar.Logo href="/" img={AppLogo} imgAlt="App logo" as="div">
          <span className="text-clightgreen text-2xl">ArguSure</span>
        </Sidebar.Logo>
        <hr className="border-clightgreen mb-12" />
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Link to="/">
              <Sidebar.Item active={path === "/"} as="div">
                <section className={path === "/" ? "text-clight" : ""}>
                  HOME
                </section>
              </Sidebar.Item>
            </Link>
            <Link to="/liked">
              <Sidebar.Item active={path === "/liked"} as="div">
                <span className={path === "/liked" ? "text-clight" : ""}>
                  LIKED
                </span>
              </Sidebar.Item>
            </Link>
            <Link to="/disliked">
              <Sidebar.Item active={path === "/disliked"} as="div">
                <span className={path === "/disliked" ? "text-clight" : ""}>
                  DISLIKED
                </span>
              </Sidebar.Item>
            </Link>
            <Link to="/saved">
              <Sidebar.Item active={path === "/saved"} as="div">
                <span className={path.includes("/saved") ? "text-clight" : ""}>
                  SAVED
                </span>
              </Sidebar.Item>
            </Link>
            <Link to="/history">
              <Sidebar.Item active={path === "/history"} as="div">
                <span className={path === "/history" ? "text-clight" : ""}>
                  HISTORY
                </span>
              </Sidebar.Item>
            </Link>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
        <HeaderProfile />
      </Sidebar>
    </>
  );
}
