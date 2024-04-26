import React from "react";
import { Button, Modal, Spinner } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  hideDeleteModal,
} from "../redux/user/userSlice";
import {
  setPromptText,
  showPrompt,
  hidePrompt,
} from "../redux/counterargument/counterargSlice";
import Prompt from "./Prompt";

export default function DeleteUserModal({ userToDelete }) {
  const { currentUser, showModal, loading } = useSelector(
    (state) => state.user
  );
  const { prompt, promptText } = useSelector((state) => state.counterarg);
  const dispatch = useDispatch();
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const handleDeleteUser = async () => {
    try {
      !userToDelete && dispatch(deleteUserStart());
      const res = await fetch(
        `/api/user/delete/${userToDelete ? userToDelete : currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        !userToDelete && dispatch(deleteUserFailure(data.message));
      } else {
        !userToDelete && dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      !userToDelete && dispatch(deleteUserFailure(error.message));
    }
    dispatch(hideDeleteModal());
    dispatch(setPromptText("DELETED"));
    dispatch(showPrompt());
    await delay(2000);
    dispatch(setPromptText(""));
    dispatch(hidePrompt());
  };

  return (
    <Modal
      show={showModal}
      onClose={() => dispatch(hideDeleteModal())}
      popup
      size="md"
    >
      <Modal.Header className="bg-clight" />
      <Modal.Body className="bg-clight">
        <div className="text-center">
          <HiOutlineExclamationCircle className="h-14 w-14 text-cblack mb-2 mx-auto" />
          <div className="mb-5 text-lg text-cblack font-semibold">
            Are you sure you want to delete this account?
          </div>
          <div className="flex justify-center gap-4">
            <Button
              className="bg-cbrown text-clight font-semibold"
              onClick={handleDeleteUser}
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
              onClick={() => dispatch(hideDeleteModal())}
            >
              <span className="text-cbrown font-semibold">No, cancel</span>
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
