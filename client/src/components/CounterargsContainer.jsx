import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { FiSave, FiFileMinus } from "react-icons/fi";
import { RiPlayListAddFill } from "react-icons/ri";
import { CgPlayListRemove } from "react-icons/cg";
import { Avatar, Dropdown } from "flowbite-react";
import SaveTo from "./SaveTo";
import { showSaveToModal, updateSuccess } from "../redux/user/userSlice";

export default function CounterargsContainer({ counterargument, withClaim }) {
  const claim =
    counterargument.inputClaim.charAt(0).toUpperCase() +
    counterargument.inputClaim.slice(1);
  const summary = counterargument.summary;
  const body = counterargument.body;
  const source = counterargument.source;
  const [savedTo, setSavedTo] = useState(counterargument.savedTo);
  const [readMore, setReadMore] = useState(false);
  const [liked, setLiked] = useState(counterargument.liked);
  const [isSaved, setIsSaved] = useState(counterargument.savedTo.length !== 0);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleRead = () => {
    setReadMore(!readMore);
  };

  const handleLike = async (action) => {
    const dataBody = {
      userId: counterargument.userId,
      _id: counterargument._id,
      liked: action,
    };
    try {
      const res = await fetch("/api/counterarg/like", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataBody),
      });
      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      } else {
        setLiked(action);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSave = async () => {
    const dataBody = {
      userId: currentUser._id,
      counterargId: counterargument._id,
      selectedTopics: ["default"],
    };
    try {
      const res = await fetch("/api/saved/save", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataBody),
      });
      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      } else {
        setIsSaved(true);
        setSavedTo(["default"]);
        dispatch(updateSuccess(data.userWithUpdatedSaved));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleUnsave = async () => {
    const dataBody = {
      userId: currentUser._id,
      counterargId: counterargument._id,
      savedTo: savedTo,
      removeFrom: savedTo, // need some fixes
    };
    try {
      const res = await fetch("/api/saved/unsave", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataBody),
      });
      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      } else {
        setIsSaved(false);
        setSavedTo([]);
        dispatch(updateSuccess(data.userWithUpdatedSaved));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex flex-col w-[60rem] mx-auto my-5 shadow-lg rounded-lg bg-clight text-cblack">
      {withClaim && (
        <div className="font-bold text-base bg-cgreen px-5 py-3 rounded-t-lg">
          <u>Input claim</u>: {claim}
        </div>
      )}
      <div className={"flex gap-12 p-5 " + (readMore ? "h-full" : "h-64")}>
        <div className="flex flex-col gap-0 text-justify max-w-[50rem]">
          <div className="font-bold text-base italic">{summary}</div>
          <div className="overflow-hidden mt-2">
            <div>{body}</div>
            <div className="mt-2">
              <span className="font-semibold">Source:</span>
              <br />
              {source}
            </div>
          </div>
          <div
            className="read-more mx-auto underline text-sm hover:cursor-pointer opacity-80 pt-2 w-full text-center"
            onClick={handleRead}
          >
            {readMore ? "Read less" : "Read more"}
          </div>
        </div>
        <div className="text-cblack">
          <div className="flex justify-end ">
            <Dropdown
              className="bg-clight"
              inline
              arrowIcon={false}
              label={
                <Avatar
                  alt="meatballs"
                  img={BsThreeDots}
                  className="size-5 mr-2"
                />
              }
            >
              {isSaved ? (
                <Dropdown.Item
                  icon={FiFileMinus}
                  className="text-cbrown mr-3"
                  onClick={handleUnsave}
                >
                  <span className="text-cblack font-bold">Unsave</span>
                </Dropdown.Item>
              ) : (
                <Dropdown.Item
                  icon={FiSave}
                  className="text-cbrown mr-3"
                  onClick={handleSave}
                >
                  <span className="text-cblack font-bold">Save</span>
                </Dropdown.Item>
              )}
              <Dropdown.Item
                icon={RiPlayListAddFill}
                className="text-cbrown mr-3"
                onClick={() => dispatch(showSaveToModal())}
              >
                <span className="text-cblack font-bold">Save to...</span>
              </Dropdown.Item>
            </Dropdown>
          </div>
          <div className="flex gap-5 mt-5">
            {liked !== "liked" ? (
              <BiLike
                className="size-6 hover:cursor-pointer"
                onClick={() => handleLike("liked")}
              />
            ) : (
              <BiSolidLike
                className="size-6 text-cbrown hover:cursor-pointer"
                onClick={() => handleLike("none")}
              />
            )}
            {liked !== "disliked" ? (
              <BiDislike
                className="size-6 hover:cursor-pointer"
                onClick={() => handleLike("disliked")}
              />
            ) : (
              <BiSolidDislike
                className="size-6 text-cbrown hover:cursor-pointer"
                onClick={() => handleLike("none")}
              />
            )}
          </div>
        </div>
      </div>
      <SaveTo counterargument={counterargument} />
    </div>
  );
}
