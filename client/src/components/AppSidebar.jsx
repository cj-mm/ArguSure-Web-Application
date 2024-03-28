import React from "react";
import { Sidebar } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import AppLogo from "../assets/logo.png";

export default function AppSidebar() {
  const path = useLocation().pathname;

  return (
    <Sidebar className="h-screen bg-cgreen">
      <Sidebar.Logo href="/" img={AppLogo} imgAlt="App logo" as="div">
        <span className="text-clightgreen">Lorem Ipsum</span>
      </Sidebar.Logo>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to="/">
            <Sidebar.Item active={path === "/"} as="div">
              Home
            </Sidebar.Item>
          </Link>
          <Link to="/liked">
            <Sidebar.Item active={path === "/liked"} as="div">
              Liked
            </Sidebar.Item>
          </Link>
          <Link to="/disliked">
            <Sidebar.Item active={path === "/disliked"} as="div">
              Disliked
            </Sidebar.Item>
          </Link>
          <Link to="/saved">
            <Sidebar.Item active={path === "/saved"} as="div">
              Saved
            </Sidebar.Item>
          </Link>
          <Link to="/history">
            <Sidebar.Item active={path === "/history"} as="div">
              History
            </Sidebar.Item>
          </Link>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
