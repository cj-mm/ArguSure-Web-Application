import React, { useState } from "react";
import { TextInput } from "flowbite-react";
import { useDispatch } from "react-redux";
import {
  MdOutlineDriveFileRenameOutline,
  MdDeleteOutline,
} from "react-icons/md";
import { updateSuccess } from "../redux/user/userSlice";

export default function TopicListItem({ topic }) {
  const [renameValue, setRenameValue] = useState("");
  const [renaming, setRenaming] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setRenameValue(e.target.value);
  };

  const handleRenameBtn = (curName) => {
    setRenameValue(curName);
    setRenaming(!renaming);
  };

  const handleRenameTopic = async (e) => {
    e.preventDefault();
    const dataBody = {
      curTopicName: topic.topicName,
      newTopicName: renameValue,
    };

    try {
      const res = await fetch("/api/saved/renametopic", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataBody),
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(updateSuccess(data));
        setRenaming(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="bg-clightgreen cshadow rounded flex gap-1 items-center hover:cursor-pointer h-14 p-2">
      {renaming ? (
        <form onSubmit={handleRenameTopic}>
          <TextInput
            type="text"
            placeholder="Enter to rename"
            onChange={handleChange}
            value={renameValue}
          />
        </form>
      ) : (
        <span className="text-cblack font-bold truncate w-3/4">
          {topic.topicName}
        </span>
      )}
      <div className="flex-1"></div>
      <MdOutlineDriveFileRenameOutline
        className="size-5 text-clight hover:text-cbrown"
        onClick={() => handleRenameBtn(topic.topicName)}
      />
      <MdDeleteOutline className="size-5 text-clight hover:text-red-400" />
    </div>
  );
}
