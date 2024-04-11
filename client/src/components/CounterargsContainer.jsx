import React, { useEffect, useReducer, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { FiSave, FiFileMinus } from "react-icons/fi";
import { CgPlayListRemove } from "react-icons/cg";
import { RiPlayListAddFill } from "react-icons/ri";
import { Avatar, Dropdown } from "flowbite-react";
import { updateSuccess } from "../redux/user/userSlice";
import {
  showSaveToModal,
  setSelectedCounterarg,
  setDisplayedCounterargs,
  removeFromSavedCounterargs,
  addToSavedCounterargs,
} from "../redux/counterargument/counterargSlice";
import SaveTo from "./SaveTo";

export default function CounterargsContainer({ counterargument, withClaim }) {
  const claim =
    counterargument.inputClaim.charAt(0).toUpperCase() +
    counterargument.inputClaim.slice(1);
  const summary = counterargument.summary;
  const body = counterargument.body;
  const source = counterargument.source;
  const [readMore, setReadMore] = useState(false);
  const [liked, setLiked] = useState(counterargument.liked);
  const { currentUser } = useSelector((state) => state.user);
  const { displayedCounterargs, savedCounterargs } = useSelector(
    (state) => state.counterarg
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setDisplayedCounterargs(counterargument));

    let tempDisplayedCounterargs = displayedCounterargs;
    const uniqueArray = tempDisplayedCounterargs.filter((value, index) => {
      const _value = JSON.stringify(value);
      return (
        index ===
        tempDisplayedCounterargs.findIndex((obj) => {
          return JSON.stringify(obj) === _value;
        })
      );
    });

    dispatch(setDisplayedCounterargs("reset"));
    for (let i = 0; i < uniqueArray.length; i++) {
      dispatch(setDisplayedCounterargs(uniqueArray[i]));
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
        dispatch(addToSavedCounterargs(counterargument._id));
        dispatch(updateSuccess(data.userWithUpdatedSaved));
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
        dispatch(removeFromSavedCounterargs(counterargument._id));
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
              {Array.isArray(savedCounterargs) &&
              savedCounterargs.includes(counterargument._id) ? (
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
                onClick={() => {
                  dispatch(showSaveToModal());
                  dispatch(setSelectedCounterarg(counterargument));
                }}
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
      <SaveTo />
    </div>
  );
}
