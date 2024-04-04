import React, { useState } from "react";
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";

export default function CounterargsContainer({ counterargument, withClaim }) {
  const claim =
    counterargument.inputClaim.charAt(0).toUpperCase() +
    counterargument.inputClaim.slice(1);
  const summary = counterargument.summary;
  const body = counterargument.body;
  const source = counterargument.source;
  const [readMore, setReadMore] = useState(false);
  const [liked, setLiked] = useState(counterargument.liked);

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
            <BsThreeDots className="size-8 hover:cursor-pointer" />
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
    </div>
  );
}
