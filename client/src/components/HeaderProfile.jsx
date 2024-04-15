import React from "react";
import { useSelector } from "react-redux";
import { Dropdown } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { BsFillPersonFill, BsBoxArrowInRight } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { signOutSuccess } from "../redux/user/userSlice";

export default function HeaderProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const path = useLocation().pathname;

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return currentUser ? (
    <div className="header-profile absolute bottom-5 w-52 shadow-lg bg-cgreen rounded-lg px-3 py-1 hover:shadow-xl">
      <Dropdown
        className="mb-3"
        size="lg"
        inline
        label={
          <>
            <img
              src={currentUser.profilePicture}
              alt="user"
              className="rounded-full"
              height={100}
            />
            <span
              className={
                "text-cblack text-lg font-bold truncate " +
                (path === "/profile" ? "text-clight" : "")
              }
            >
              {currentUser.username}
            </span>
          </>
        }
        arrowIcon={false}
      >
        <Dropdown.Header className="pt-2 pb-1 text-cblack">
          <span className="block truncate">{currentUser.email}</span>
        </Dropdown.Header>
        <hr className="w-[95%] border-clightgreen m-auto" />
        <Link to="/profile">
          <Dropdown.Item icon={BsFillPersonFill} className="text-cbrown">
            <span
              className={
                "text-cblack " + (path === "/profile" ? "text-clight" : "")
              }
            >
              Profile
            </span>
          </Dropdown.Item>
        </Link>
        <Dropdown.Item icon={BsBoxArrowInRight} className="text-cbrown">
          <span onClick={handleSignout} className="text-cblack">
            Sign out
          </span>
        </Dropdown.Item>
      </Dropdown>
    </div>
  ) : (
    <div></div>
  );
}
