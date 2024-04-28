import React from "react";
import { Button, Modal, Spinner } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { updateSuccess } from "../redux/user/userSlice";
import {
  hideUnsaveModal,
  removeFromSavedCounterargs,
  setUnsaveDataBody,
  setPromptText,
  showPrompt,
  hidePrompt,
} from "../redux/counterargument/counterargSlice";
import { useLocation } from "react-router-dom";

export default function UnsaveModal() {
  const { loading } = useSelector((state) => state.user);
  const { unsaveModal, unsaveDataBody } = useSelector(
    (state) => state.counterarg
  );
  const dispatch = useDispatch();
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  const location = useLocation();

  const handleUnsave = async () => {
    try {
      const res = await fetch("/api/saved/unsave", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(unsaveDataBody),
      });
      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(removeFromSavedCounterargs(unsaveDataBody.counterargId));
        dispatch(updateSuccess(data.userWithUpdatedSaved));
      }
    } catch (error) {
      console.log(error.message);
    }
    dispatch(setUnsaveDataBody({}));
    dispatch(hideUnsaveModal());
    dispatch(setPromptText("UNSAVED"));
    dispatch(showPrompt());
    await delay(2000);
    dispatch(setPromptText(""));
    dispatch(hidePrompt());
  };

  return (
    <Modal
      show={unsaveModal}
      onClose={() => dispatch(hideUnsaveModal())}
      popup
      size="md"
    >
      <Modal.Header className="bg-clight" />
      <Modal.Body className="bg-clight">
        <div className="text-center">
          <HiOutlineExclamationCircle className="h-14 w-14 text-cblack mx-auto" />
          {location.pathname.includes("/saved/topics") ? (
            <>
              <div className=" text-lg text-cblack font-semibold">
                Are you sure you want to remove the counterargument from this
                topic?
              </div>
              <div className="text-xs text-cblack mb-7">
                Note: This action will remove the counterargument from this
                topic only and not in the saved section
              </div>
            </>
          ) : (
            <>
              <div className=" text-lg text-cblack font-semibold">
                Are you sure you want to unsave this counterargument?
              </div>
              <div className="text-xs text-cblack mb-7">
                Note: This action will remove this counterargument from saved
                section and every topic it is saved
              </div>
            </>
          )}
          <div className="flex justify-center gap-4">
            <Button
              className="bg-cbrown text-clight font-semibold"
              onClick={handleUnsave}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Yes, I'm sure"
              )}
            </Button>
            <Button
              className="inner-border-cbrown bg-clight inner-border-solid inner-border-2"
              onClick={() => dispatch(hideUnsaveModal())}
            >
              <span className="text-cbrown font-semibold">No, cancel</span>
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
