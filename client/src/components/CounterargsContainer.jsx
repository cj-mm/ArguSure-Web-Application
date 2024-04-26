import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { FiSave, FiFileMinus } from "react-icons/fi";
import { RiPlayListAddFill } from "react-icons/ri";
import { IoIosRemoveCircleOutline } from "react-icons/io";
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
  setPromptText,
  showPrompt,
  hidePrompt,
} from "../redux/counterargument/counterargSlice";
import SaveTo from "./SaveTo";
import { useLocation, useParams } from "react-router-dom";
import UnsaveModal from "./UnsaveModal";
import Prompt from "./Prompt";

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
  const { savedCounterargs, prompt, promptText } = useSelector(
    (state) => state.counterarg
  );
  const dispatch = useDispatch();
  const location = useLocation();
  const { topicSlug } = useParams();
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

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
    let savedTo = [];
    if (topicSlug) {
      for (let i = 0; i < currentUser.saved.length; i++) {
        const topic = currentUser.saved[i];
        if (
          topic.counterarguments.includes(counterargument._id) ||
          topic.slug === topicSlug
        ) {
          savedTo.push(topic.topicName);
        }
      }
    }
    const dataBody = {
      userId: currentUser._id,
      counterargId: counterargument._id,
      selectedTopics: topicSlug ? savedTo : ["default"],
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
        dispatch(setPromptText("SAVED"));
        dispatch(showPrompt());
        await delay(2000);
        dispatch(setPromptText(""));
        dispatch(hidePrompt());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleUnsave = async () => {
    let savedTo = [];
    let removeFromTopic = "";
    for (let i = 0; i < currentUser.saved.length; i++) {
      const topic = currentUser.saved[i];
      if (topic.counterarguments.includes(counterargument._id)) {
        savedTo.push(topic.topicName);
      }
      if (topic.slug === topicSlug) {
        removeFromTopic = topic.topicName;
      }
    }
    const dataBody = {
      userId: currentUser._id,
      counterargId: counterargument._id,
      savedTo: savedTo,
      removeFrom: topicSlug ? removeFromTopic : savedTo,
    };
    dispatch(setUnsaveDataBody(dataBody));
    dispatch(showUnsaveModal());
  };

  return (
    <div className="counterarg-container flex flex-col w-[60rem] mx-auto my-5 cshadow rounded-lg bg-clight text-cblack">
      {withClaim && (
        <div className="font-semibold text-sm sm:text-base bg-cgreen px-2 py-2 sm:px-5 sm:py-3 rounded-t-lg">
          <u>Input claim</u>: {claim}
        </div>
      )}
      <div
        className={
          "counterarg-text text-sm sm:text-base flex gap-5 sm:gap-12 p-2 sm:p-5 " +
          (readMore ? "h-full" : "h-32 sm:h-64")
        }
      >
        <div className=" flex flex-col gap-0 text-justify max-w-[55rem] break-normal ">
          <div className="overflow-hidden">
            <div className="font-semibold text-sm sm:text-base italic">
              {summary}
            </div>
            <div className=" mt-2 ">
              <div>{body}</div>
              <div className="mt-2">
                <span className="font-semibold">Source:</span>
                <br />
                <div className="max-w-[15rem] sm:max-w-[55rem] break-normal">
                  {source}
                </div>
              </div>
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
                  className="size-5 w-11 rounded-full hover:bg-gray-300"
                />
              }
            >
              {Array.isArray(savedCounterargs) &&
              savedCounterargs.includes(counterargument._id) ? (
                location.pathname.includes("/saved/topics") ? (
                  <Dropdown.Item
                    icon={IoIosRemoveCircleOutline}
                    className="text-cbrown mr-3"
                    onClick={handleUnsave}
                  >
                    <span className="text-cblack font-bold">
                      Remove from topic
                    </span>
                  </Dropdown.Item>
                ) : (
                  <Dropdown.Item
                    icon={FiFileMinus}
                    className="text-cbrown mr-3"
                    onClick={handleUnsave}
                  >
                    <span className="text-cblack font-bold">Unsave</span>
                  </Dropdown.Item>
                )
              ) : location.pathname.includes("/saved/topics") ? (
                <Dropdown.Item
                  icon={FiSave}
                  className="text-cbrown mr-3"
                  onClick={handleSave}
                >
                  <span className="text-cblack font-bold">Add to topic</span>
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
          <div className="flex gap-2 sm:gap-5 mt-5">
            {liked !== "liked" ? (
              <BiLike
                className="size-5 sm:size-6 hover:cursor-pointer hover:text-cbrown"
                onClick={() => handleLike("liked")}
              />
            ) : (
              <BiSolidLike
                className="size-5 sm:size-6 text-cbrown hover:cursor-pointer"
                onClick={() => handleLike("none")}
              />
            )}
            {liked !== "disliked" ? (
              <BiDislike
                className="size-5 sm:size-6 hover:cursor-pointer hover:text-cbrown"
                onClick={() => handleLike("disliked")}
              />
            ) : (
              <BiSolidDislike
                className="size-5 sm:size-6 text-cbrown hover:cursor-pointer"
                onClick={() => handleLike("none")}
              />
            )}
          </div>
        </div>
      </div>
      <SaveTo />
      <UnsaveModal />
      {prompt && promptText && <Prompt promptText={promptText} />}
    </div>
  );
}
