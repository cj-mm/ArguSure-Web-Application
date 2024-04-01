import React, { useState } from "react";
import {
  FaRegThumbsDown,
  FaRegThumbsUp,
  FaThumbsDown,
  FaThumbsUp,
} from "react-icons/fa";
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";

export default function CounterargsContainer({ counterargument }) {
  const summary = counterargument.summary;
  const body = counterargument.body;
  const source = counterargument.source;
  const [readMore, setReadMore] = useState(false);

  const handleRead = () => {
    setReadMore(!readMore);
  };

  return (
    <div
      className={
        "flex gap-12 mt-10 w-[60rem] mx-auto bg-clight shadow-lg p-5 rounded-lg text-cblack " +
        (readMore ? "h-full" : "h-64")
      }
    >
      <div className="flex flex-col gap-0 text-justify">
        <div className="font-bold text-base">{summary}</div>
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
      <div>
        <div className="flex justify-end ">
          <BsThreeDots className="size-8 hover:cursor-pointer" />
        </div>
        <div className="flex gap-5 mt-5">
          <BiLike className="size-6 hover:cursor-pointer" />
          <BiDislike className="size-6 hover:cursor-pointer" />
        </div>
      </div>
    </div>
  );
}
