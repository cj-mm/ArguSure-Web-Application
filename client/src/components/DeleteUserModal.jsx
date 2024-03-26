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

export default function DeleteUserModal() {
  const { currentUser, showModal, loading } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
    dispatch(hideDeleteModal());
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
          <HiOutlineExclamationCircle className="h-14 w-14 text-cblack  mb-4 mx-auto" />
          <h3 className="mb-5 text-lg text-cblack">
            Are you sure you want to delete your account?
          </h3>
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
