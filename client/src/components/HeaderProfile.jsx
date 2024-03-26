import React from "react";
import { useSelector } from "react-redux";
import { Avatar, Dropdown } from "flowbite-react";
import { Link } from "react-router-dom";
import { BsFillPersonFill, BsBoxArrowInRight } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { signOutSuccess } from "../redux/user/userSlice";

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
    <div className="absolute right-7 top-3 bg-clight shadow-xl rounded-full px-3 py-1">
      <Dropdown
        className="bg-clight mt-2"
        size="sm"
        inline
        label={<Avatar alt="user" img={currentUser.profilePicture} rounded />}
      >
        <Dropdown.Header className="py-0 text-cblack">
          <span className="block font-bold text-base">
            @{currentUser.username}
          </span>
          <span className="block truncate">{currentUser.email}</span>
        </Dropdown.Header>
        <Dropdown.Divider className="bg-cgreen" />
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
