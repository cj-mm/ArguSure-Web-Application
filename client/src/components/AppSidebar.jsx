import React from "react";
import { Sidebar } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import AppLogo from "../assets/logo.png";

export default function AppSidebar() {
  const path = useLocation().pathname;

  return (
    <Sidebar className="h-screen app-sidebar w-60 fixed">
      <Sidebar.Logo href="/" img={AppLogo} imgAlt="App logo" as="div">
        <span className="text-clightgreen">Lorem Ipsum</span>
      </Sidebar.Logo>
      <hr className="border-clightgreen mb-12" />
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to="/">
            <Sidebar.Item active={path === "/"} as="div">
              <span className={path === "/" ? "text-clight" : ""}>HOME</span>
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
    </Sidebar>
  );
}
