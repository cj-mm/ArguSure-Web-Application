import React, { useEffect, useState } from "react";
import {
  RiPlayListAddFill,
  RiArrowDropDownLine,
  RiArrowDropUpLine,
} from "react-icons/ri";
import { Modal, Checkbox, Label, Button } from "flowbite-react";
import { useSelector, useDispatch } from "react-redux";
import {
  hideSaveToModal,
  showAddTopic,
  hideAddTopic,
  updateSuccess,
  addToSavedCounterargs,
} from "../redux/user/userSlice";
import AddTopic from "./AddTopic";

export default function SaveTo() {
  const { currentUser, saveToModal, addTopic, selectedCounterarg } =
    useSelector((state) => state.user);
  const [checkedTopics, setCheckedTopics] = useState();
  const dispatch = useDispatch();
  const counterargument = selectedCounterarg;

  useEffect(() => {
    let currentCheckedTopics = [];
    for (let i = 0; i < currentUser.saved.length; i++) {
      const topic = currentUser.saved[i];
      if (
        topic.counterarguments.includes(counterargument._id) &&
        topic.topicName !== "default"
      ) {
        currentCheckedTopics.push(topic.topicName);
      }
    }
    setCheckedTopics(currentCheckedTopics);
  }, []);

  const handleCheckBox = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setCheckedTopics((pre) => [...pre, value]);
    } else {
      setCheckedTopics((pre) => {
        return [...pre.filter((topic) => topic !== value)];
      });
    }
  };

  const handleSaveToSubmit = async () => {
    const dataBody = {
      userId: currentUser._id,
      counterargId: counterargument._id,
      selectedTopics: ["default"].concat(checkedTopics),
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
        dispatch(addToSavedCounterargs(selectedCounterarg._id));
        dispatch(updateSuccess(data.userWithUpdatedSaved));
        dispatch(hideSaveToModal());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Modal
      show={saveToModal}
      popup
      size="sm"
      className="saveto-modal"
      onClose={() => {
        dispatch(hideSaveToModal());
        dispatch(hideAddTopic());
      }}
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
                  {topic.counterarguments.includes(counterargument._id) ? (
                    <Checkbox
                      id={topic.topicName}
                      value={topic.topicName}
                      defaultChecked
                      onChange={handleCheckBox}
                    />
                  ) : (
                    <Checkbox
                      id={topic.topicName}
                      value={topic.topicName}
                      onChange={handleCheckBox}
                    />
                  )}
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
            <Button
              className="bg-cbrown text-clight font-semibold w-22 h-9 hover:shadow-lg"
              onClick={handleSaveToSubmit}
            >
              Done
            </Button>
            <Button
              className="inner-border-cbrown bg-clight inner-border-solid inner-border-2 w-20 h-9 hover:shadow-lg"
              onClick={() => {
                dispatch(hideSaveToModal());
                dispatch(hideAddTopic());
              }}
            >
              <span className="text-cbrown font-semibold">Cancel</span>
            </Button>
          </div>
          <div className="text-center mt-2 text-sm underline text-cbrown">
            {addTopic ? (
              <span
                className="hover:cursor-pointer"
                onClick={() => dispatch(hideAddTopic())}
              >
                Add a topic <RiArrowDropUpLine className="inline size-6" />{" "}
              </span>
            ) : (
              <span
                className="hover:cursor-pointer"
                onClick={() => dispatch(showAddTopic())}
              >
                Add a topic <RiArrowDropDownLine className="inline size-6" />
              </span>
            )}
          </div>
        </div>
        <AddTopic />
      </Modal.Body>
    </Modal>
  );
}
