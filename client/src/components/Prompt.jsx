import React from "react";

export default function Prompt({ promptText }) {
  return (
    <div className="prompt fixed bottom-5 left-64 w-48 h-12 bg-clightgreen rounded shadow-md text-base font-semibold">
      <div className="flex h-full w-full">
        <span className="m-auto">{promptText}</span>
      </div>
    </div>
  );
}
