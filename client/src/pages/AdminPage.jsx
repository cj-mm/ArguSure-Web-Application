import React from "react";
import { FaUsers } from "react-icons/fa";
import { BsFillChatSquareTextFill } from "react-icons/bs";
import { FaFolderOpen } from "react-icons/fa6";
import { BiSolidLike, BiSolidDislike } from "react-icons/bi";

export default function () {
  return (
    <div className="page-container w-full h-full mt-5 ml-60">
      <div className="flex flex-col gap-2 w-full m-auto mb-5">
        <div className="w-full my-5 text-center text-base sm:text-xl font-bold text-cblack">
          Admin Page
        </div>
        <div className="topic-list grid grid-cols-1 sm:grid-cols-3 grid-flow-row gap-4 text-cblack w-[60rem] m-auto p-2 rounded border-x-2 border-t-2 border-gray-400">
          <div className="flex gap-1 h-20 bg-clight rounded cshadow p-3">
            <div className="flex flex-1 flex-col">
              <span className="flex-1 text-sm">Users Total</span>
              <span className="text-2xl font-bold">169</span>
            </div>
            <FaUsers className="size-14 text-cgreen m-auto" />
          </div>
          <div className="flex gap-1 h-20 bg-clight rounded cshadow p-3">
            <div className="flex flex-1 flex-col">
              <span className="flex-1 text-sm">Counterarguments Total</span>
              <span className="text-2xl font-bold">169</span>
            </div>
            <BsFillChatSquareTextFill className="size-12 text-cgreen m-auto" />
          </div>
          <div className="flex gap-1 h-20 bg-clight rounded cshadow p-3">
            <div className="flex flex-1 flex-col">
              <span className="flex-1 text-sm">Topics Total</span>
              <span className="text-2xl font-bold">169</span>
            </div>
            <FaFolderOpen className="size-12 text-cgreen m-auto" />
          </div>
        </div>
        <div className="topic-list grid grid-cols-1 sm:grid-cols-3 grid-flow-row gap-4 w-[60rem] m-auto mb-5 p-2 rounded border-x-2 border-b-2 border-gray-400">
          <div className="flex flex-col gap-3">
            <div className="flex gap-1 h-20 bg-clight rounded cshadow p-3">
              <div className="flex flex-1 flex-col">
                <span className="flex-1 text-sm">Likes Total</span>
                <span className="text-2xl font-bold">169</span>
              </div>
              <BiSolidLike className="size-12 text-cgreen m-auto" />
            </div>
            <div className="flex gap-1 h-20 bg-clight rounded cshadow p-3">
              <div className="flex flex-1 flex-col">
                <span className="flex-1 text-sm">Dislikes Total</span>
                <span className="text-2xl font-bold">169</span>
              </div>
              <BiSolidDislike className="size-12 text-cgreen m-auto" />
            </div>
          </div>
          <div className="h-40 sm:h-full bg-clightgreen rounded cshadow"></div>
          <div className="h-40 sm:h-full bg-clightgreen rounded cshadow"></div>
        </div>
        <div></div>
      </div>
    </div>
  );
}
