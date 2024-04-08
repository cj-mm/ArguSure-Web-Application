import React, { useState } from "react";
import { RiPlayListAddFill } from "react-icons/ri";
import { Modal, Checkbox, Label, Button } from "flowbite-react";
import { useSelector } from "react-redux";
import { hideSaveToModal } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

export default function SaveTo() {
  const { currentUser, saveToModal } = useSelector((state) => state.user);
  const [checkedTopics, setCheckedTopics] = useState([]);
  const dispatch = useDispatch();

  const handleCheckBox = (e) => {};

  return (
    <Modal
      show={saveToModal}
      popup
      size="sm"
      className="addtopic-modal"
      onClose={() => dispatch(hideSaveToModal())}
    >
      <Modal.Header className="bg-clight">
        <div className="flex gap-2 mt-2 pl-4">
          <RiPlayListAddFill className="text-cbrown mt-1 size-4" />
          <span className="font-bold text-base text-cblack">Save to...</span>
        </div>
      </Modal.Header>
      <Modal.Body className="bg-clight overflow-hidden">
        <div
          className="flex max-w-md flex-col gap-4 mt-3 overflow-y-auto h-64"
          id="checkbox"
        >
          <div className="flex items-center gap-2 bg-clightgreen p-3 rounded shadow-lg">
            <Checkbox id="disabled" disabled defaultChecked />
            <Label htmlFor="disabled" disabled>
              Default (All topics)
            </Label>
          </div>
          {currentUser.saved.map((topic, index) => {
            if (topic.topicName !== "default") {
              return (
                <div
                  className="flex items-center gap-2 bg-clightgreen p-3 rounded shadow-lg"
                  key={index}
                >
                  <Checkbox id={topic.topicName} />
                  <Label htmlFor={topic.topicName} className="text-cblack">
                    {topic.topicName}
                  </Label>
                </div>
              );
            }
          })}
        </div>
        <div>
          <div className="flex justify-center gap-2 mt-3">
            <Button className="bg-cbrown text-clight font-semibold w-22 h-9">
              Done
            </Button>
            <Button
              className="inner-border-cbrown bg-clight inner-border-solid inner-border-2 w-20 h-9"
              onClick={() => dispatch(hideSaveToModal())}
            >
              <span className="text-cbrown font-semibold">Cancel</span>
            </Button>
          </div>
          <div className="text-center mt-2 text-sm underline text-cbrown hover:cursor-pointer">
            + Add a topic
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
