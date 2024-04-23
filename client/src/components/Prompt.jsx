import React from "react";
import { useLocation } from "react-router-dom";

export default function Prompt({ promptText }) {
  const path = useLocation().pathname;

  return path === "/window-popup" ? (
    <div className="popup-prompt relative bottom-14 left-3 w-48 h-12 bg-clightgreen rounded cshadow text-sm font-semibold">
      <div className="flex h-full w-full">
        <span className="m-auto">{promptText}</span>
      </div>
    </div>
  ) : (
    <div className="prompt fixed bottom-5 left-64 w-48 h-12 bg-clightgreen rounded shadow-md text-base font-semibold">
      <div className="flex h-full w-full">
        <span className="m-auto">{promptText}</span>
      </div>
    </div>
  );
}
