import React from "react";
import { FaUsers } from "react-icons/fa";
import { BsFillChatSquareTextFill } from "react-icons/bs";
import { FaFolderOpen } from "react-icons/fa6";
import { BiSolidLike, BiSolidDislike } from "react-icons/bi";
import { PieChart } from "react-minimal-pie-chart";

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
              <span className="flex-1 text-sm">Saved Total</span>
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
          <div className="h-40 sm:h-full bg-clight rounded cshadow p-3">
            <div className="text-sm mb-2">Like to Dislike Ratio</div>
            <div className="flex justify-center gap-5">
              <div className="flex flex-col gap-1 h-full text-base font-bold my-auto">
                <div className="flex gap-1">
                  <div className="h-3 w-3 bg-clightgreen rounded my-auto"></div>
                  <span>Likes: 75%</span>
                </div>
                <div className="flex gap-1">
                  <div className="h-3 w-3 bg-cgreen rounded my-auto"></div>
                  <span>Dislikes: 25%</span>
                </div>
              </div>
              <PieChart
                data={[
                  { title: "Likes", value: 25, color: "#96E1D9" },
                  { title: "Dislikes", value: 15, color: "#6EABB0" },
                ]}
                className="size-28"
              />
            </div>
          </div>
          <div className="h-full bg-clight rounded cshadow p-3">
            <div className="text-sm mb-2">Past Month</div>
            <div className="flex gap-1 text-sm justify-center">
              <div className="flex flex-col border-2 border-cgreen p-2 rounded-l truncate overflow-x-auto">
                <span>Added Users</span>
                <span>Generated Counterarguments</span>
                <span>Saved Counterarguments</span>
                <span>Liked Counterarguments</span>
                <span>Disliked Counterarguments</span>
              </div>
              <div className="flex flex-col font-bold border-2 border-cgreen p-2 rounded-r">
                <span>169</span>
                <span>169</span>
                <span>169</span>
                <span>169</span>
                <span>169</span>
              </div>
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
}
