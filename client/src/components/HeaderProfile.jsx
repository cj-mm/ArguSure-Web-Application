import React from "react";
import { useSelector } from "react-redux";
import { Avatar, Dropdown, DropdownDivider } from "flowbite-react";
import { Link } from "react-router-dom";
import { BsFillPersonFill, BsBoxArrowInRight } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { signOutSuccess } from "../redux/user/userSlice";
import { IoMdArrowDropup } from "react-icons/io";

export default function HeaderProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

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
    <div className="header-profile absolute bottom-5 w-52 cshadow bg-cgreen rounded-lg px-3 py-1">
      <Dropdown
        className="mb-3"
        size="lg"
        inline
        label={
          <>
            <img
              src={currentUser.profilePicture}
              alt="user"
              className="rounded-full h-5"
            />
            <span className="text-lg font-bold truncate">
              {currentUser.username}
            </span>
            <div className="flex-1"></div>
          </>
        }
        arrowIcon={false}
      >
        <Dropdown.Header className="pt-0 pb-2 text-cblack border-b-2 border-clightgreen">
          <span className="block font-bold text-base">
            @{currentUser.username}
          </span>
          <span className="block truncate">{currentUser.email}</span>
        </Dropdown.Header>
        <Link to="/profile">
          <Dropdown.Item icon={BsFillPersonFill} className="text-cbrown">
            <span className="text-cblack">Profile</span>
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
