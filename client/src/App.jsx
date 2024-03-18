import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Liked from "./pages/Liked";
import Disliked from "./pages/Disliked";
import Saved from "./pages/Saved";
import History from "./pages/History";
import AppSidebar from "./components/AppSidebar";
import HeaderProfile from "./components/HeaderProfile";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        {/* <AppSidebar /> */}
        <HeaderProfile />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/liked" element={<Liked />} />
          <Route path="/disliked" element={<Disliked />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
