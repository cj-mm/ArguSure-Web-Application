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
import PrivateRoute from "./components/PrivateRoute";
import TopicList from "./pages/TopicList";
import Topic from "./pages/Topic";
import PublicRoute from "./components/PublicRoute";
import WindowPopup from "./pages/WindowPopup";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route
              path="/profile"
              element={
                <>
                  <AppSidebar />
                  <Profile />
                </>
              }
            />
            <Route
              path="/liked"
              element={
                <>
                  <AppSidebar />
                  <Liked />
                </>
              }
            />
            <Route
              path="/disliked"
              element={
                <>
                  <AppSidebar />
                  <Disliked />
                </>
              }
            />
            <Route
              path="/saved"
              element={
                <>
                  <AppSidebar />
                  <Saved />
                </>
              }
            />
            <Route
              path="/history"
              element={
                <>
                  <AppSidebar />
                  <History />
                </>
              }
            />
            <Route
              path="/saved/topics"
              element={
                <>
                  <AppSidebar />
                  <TopicList />
                </>
              }
            />
            <Route
              path="/saved/topics/:topicSlug"
              element={
                <>
                  <AppSidebar />
                  <Topic />
                </>
              }
            />
            <Route
              path="/"
              element={
                <>
                  <AppSidebar />
                  <Home />
                </>
              }
            />
            <Route
              path="/admin-page"
              element={
                <>
                  <AppSidebar />
                  <AdminPage />
                </>
              }
            />
          </Route>
          <Route element={<PublicRoute />}>
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
          </Route>
          <Route path="/window-popup" element={<WindowPopup />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
