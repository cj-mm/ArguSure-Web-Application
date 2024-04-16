import React from "react";
import { Button, Modal, Spinner } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { updateSuccess } from "../redux/user/userSlice";
import {
  hideDeleteTopicModal,
  setDeleteTopicDataBody,
} from "../redux/counterargument/counterargSlice";

export default function DeleteTopicModal() {
  const { loading } = useSelector((state) => state.user);
  const { deleteTopicModal, deleteTopicDataBody } = useSelector(
    (state) => state.counterarg
  );
  const dispatch = useDispatch();

  const handleDeleteTopic = async () => {
    try {
      const res = await fetch("/api/saved/deletetopic", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deleteTopicDataBody),
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(updateSuccess(data));
      }
    } catch (error) {
      console.log(error.message);
    }
    setDeleteTopicDataBody({});
    dispatch(hideDeleteTopicModal());
  };

  return (
    <Modal
      show={deleteTopicModal}
      onClose={() => dispatch(hideDeleteTopicModal())}
      popup
      size="md"
    >
      <Modal.Header className="bg-clight" />
      <Modal.Body className="bg-clight">
        <div className="text-center">
          <HiOutlineExclamationCircle className="h-14 w-14 text-cblack mx-auto" />
          {deleteTopicDataBody && (
            <div className=" text-lg text-cblack font-semibold">
              Are you sure you want to delete {deleteTopicDataBody.topicName}{" "}
              topic?
            </div>
          )}
          {deleteTopicDataBody && (
            <div className="text-xs text-cblack mb-7">
              Note: This action will remove {deleteTopicDataBody.topicName} and
              all counterarguments saved under it
            </div>
          )}
          <div className="flex justify-center gap-4">
            <Button
              className="bg-cbrown text-clight font-semibold"
              onClick={handleDeleteTopic}
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
              onClick={() => dispatch(hideDeleteTopicModal())}
            >
              <span className="text-cbrown font-semibold">No, cancel</span>
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
