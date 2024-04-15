import React from "react";

export default function SkeletonLoader() {
  return (
    <div className="border shadow-lg bg-clight rounded-md p-4 w-[60rem] h-64 mx-auto mt-5">
      <div className="animate-pulse flex space-x-4">
        <div className="flex-1 space-y-6 py-1">
          <div className="h-2 bg-gray-300 rounded"></div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="h-2 bg-gray-300 rounded col-span-2"></div>
              <div className="h-2 bg-gray-300 rounded col-span-1"></div>
            </div>
            <div className="h-2 bg-gray-300 rounded"></div>
          </div>
          <div className="h-2 bg-gray-300 rounded"></div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="h-2 bg-gray-300 rounded col-span-1"></div>
              <div className="h-2 bg-gray-300 rounded col-span-2"></div>
            </div>
            <div className="h-2 bg-gray-300 rounded"></div>
          </div>
          <div className="h-2 bg-gray-300 rounded"></div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="h-2 bg-gray-300 rounded col-span-2"></div>
              <div className="h-2 bg-gray-300 rounded col-span-1"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
