import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { FiSave, FiFileMinus } from "react-icons/fi";
import { RiPlayListAddFill } from "react-icons/ri";
import { Avatar, Dropdown } from "flowbite-react";
import { updateSuccess } from "../redux/user/userSlice";
import {
  showSaveToModal,
  setSelectedCounterarg,
  addToSavedCounterargs,
  showUnsaveModal,
  setUnsaveDataBody,
  resetSavedCounterargs,
  setSavedCounterargs,
} from "../redux/counterargument/counterargSlice";
import SaveTo from "./SaveTo";
import UnsaveModal from "./UnsaveModal";

export default function PopupCounterargContainer({
  counterargument,
  withClaim,
}) {
  const claim =
    counterargument.inputClaim.charAt(0).toUpperCase() +
    counterargument.inputClaim.slice(1);
  const summary = counterargument.summary;
  const body = counterargument.body;
  const source = counterargument.source;
  const [readMore, setReadMore] = useState(false);
  const [liked, setLiked] = useState(counterargument.liked);
  const { currentUser } = useSelector((state) => state.user);
  const { savedCounterargs } = useSelector((state) => state.counterarg);
  const dispatch = useDispatch();

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const res = await fetch(`/api/user/getuser`, {
          method: "GET",
        });
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          dispatch(updateSuccess(null));
        } else {
          dispatch(updateSuccess(data));
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getCurrentUser();
    dispatch(resetSavedCounterargs());
    for (let i = 0; i < currentUser.saved.length; i++) {
      if (currentUser.saved[i].topicName === "default") {
        dispatch(setSavedCounterargs(currentUser.saved[i].counterarguments));
      }
    }
  }, []);

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
        console.log(savedCounterargs);
        dispatch(addToSavedCounterargs(counterargument._id));
        dispatch(updateSuccess(data.userWithUpdatedSaved));
        console.log(savedCounterargs);
        console.log(counterargument._id);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleUnsave = async () => {
    let savedTo = [];
    for (let i = 0; i < currentUser.saved.length; i++) {
      const topic = currentUser.saved[i];
      if (topic.counterarguments.includes(counterargument._id)) {
        savedTo.push(topic.topicName);
      }
    }
    const dataBody = {
      userId: currentUser._id,
      counterargId: counterargument._id,
      savedTo: savedTo,
      removeFrom: savedTo,
    };
    dispatch(setUnsaveDataBody(dataBody));
    dispatch(showUnsaveModal());
  };

  return (
    <div className="flex flex-col w-full mx-auto mb-3 mt-2 cshadow rounded-lg bg-clight text-cblack">
      {withClaim && (
        <div className="font-bold text-xs bg-cgreen px-5 py-3 rounded-t-lg">
          <u>Input claim</u>: {claim}
        </div>
      )}
      <div className={"flex gap-3 p-2 " + (readMore ? "h-full" : "h-32")}>
        <div className="flex flex-col gap-0 text-justify max-w-[30rem] break-normal">
          <div className="overflow-hidden">
            <div className="font-bold text-sm">{summary}</div>
            <div className=" mt-2 text-sm">
              <div>{body}</div>
              <div className="mt-2">
                <span className="font-semibold">Source:</span>
                <br />
                {source}
              </div>
            </div>
          </div>
          <div
            className="read-more mx-auto underline text-xs hover:cursor-pointer opacity-80 pt-2 w-full text-center"
            onClick={handleRead}
          >
            {readMore ? "Read less" : "Read more"}
          </div>
        </div>
        <div className="text-cblack">
          <div className="flex justify-end">
            <Dropdown
              className="bg-clight"
              inline
              arrowIcon={false}
              label={
                <Avatar
                  alt="meatballs"
                  img={BsThreeDots}
                  className="size-2 w-full mt-1 rounded-full hover:bg-gray-300"
                  size="xs"
                />
              }
            >
              {Array.isArray(savedCounterargs) &&
              savedCounterargs.includes(counterargument._id) ? (
                <Dropdown.Item
                  icon={FiFileMinus}
                  className="text-cbrown mr-3"
                  onClick={handleUnsave}
                >
                  <span className="text-cblack font-bold text-xs">Unsave</span>
                </Dropdown.Item>
              ) : (
                <Dropdown.Item
                  icon={FiSave}
                  className="text-cbrown mr-3"
                  onClick={handleSave}
                >
                  <span className="text-cblack font-bold text-xs">Save</span>
                </Dropdown.Item>
              )}
              <Dropdown.Item
                icon={RiPlayListAddFill}
                className="text-cbrown mr-3"
                onClick={() => {
                  dispatch(showSaveToModal());
                  dispatch(setSelectedCounterarg(counterargument));
                }}
              >
                <span className="text-cblack font-bold text-xs">
                  Save to...
                </span>
              </Dropdown.Item>
            </Dropdown>
          </div>
          <div className="flex gap-2 mt-7">
            {liked !== "liked" ? (
              <BiLike
                className="size-5 hover:cursor-pointer hover:text-cbrown"
                onClick={() => handleLike("liked")}
              />
            ) : (
              <BiSolidLike
                className="size-5 text-cbrown hover:cursor-pointer"
                onClick={() => handleLike("none")}
              />
            )}
            {liked !== "disliked" ? (
              <BiDislike
                className="size-5 hover:cursor-pointer hover:text-cbrown"
                onClick={() => handleLike("disliked")}
              />
            ) : (
              <BiSolidDislike
                className="size-5 text-cbrown hover:cursor-pointer"
                onClick={() => handleLike("none")}
              />
            )}
          </div>
        </div>
      </div>
      <SaveTo />
      <UnsaveModal />
    </div>
  );
}
