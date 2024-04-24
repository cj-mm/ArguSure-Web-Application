import { Alert, Button, Label, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { FaArrowLeft } from "react-icons/fa";
import { useSelector } from "react-redux";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  showDeleteModal,
  signOutSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import DeleteUserModal from "../components/DeleteUserModal";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { currentUser, error } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError("Could not upload image");
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserSuccess(null);
    setUpdateUserError(null);

    if (
      Object.keys(formData).length === 0 ||
      (formData.newpassword === "" &&
        formData.username === currentUser.username)
    ) {
      setUpdateUserError("No changes made");
      return;
    }

    if (!formData.curpassword) {
      setUpdateUserError("Please fill in current password");
      return;
    }

    if (formData.newpassword) {
      if (formData.newpassword !== formData.confirmpassword) {
        setUpdateUserError("Passwords do not match");
      }
    }

    if (imageFileUploading) {
      setUpdateUserError("Please wait for image to upload");
      return;
    }

    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      setUpdateUserError(error.message);
      dispatch(updateFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // const handleCancel = () => {
  //   setFormData({
  //     username: currentUser.username,
  //     newpassword: "",
  //     confirmpassword: "",
  //     curpassword: "",
  //   });
  // };

  return (
    <div className="page-container w-full h-full ml-60 mt-5">
      <div className="profile-page bg-clight text-cgreen shadow-2xl w-3/4 lg:w-2/3 rounded-md self-center flex-col mx-auto mt-7 p-2">
        <div className="mt-5 flex">
          <FaArrowLeft
            className="size-5 sm:size-7 text-cbrown ml-3 absolute hover:cursor-pointer hover:text-yellow-800"
            onClick={() => navigate(-1)}
          />
          <span className="font-black text-2xl sm:text-3xl m-auto">
            Profile
          </span>
        </div>
        <div className="sm:my-5 sm:mx-10">
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={filePickerRef}
              hidden
            />
            <div
              className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
              onClick={() => filePickerRef.current.click()}
            >
              {imageFileUploadProgress && (
                <CircularProgressbar
                  value={imageFileUploadProgress || 0}
                  text={`${imageFileUploadProgress}%`}
                  strokeWidth={5}
                  styles={{
                    root: {
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    },
                    path: {
                      stroke: `rgba(62, 152, 199, ${
                        imageFileUploadProgress / 100
                      })`,
                    },
                  }}
                />
              )}
              <img
                src={imageFileUrl || currentUser.profilePicture}
                alt="user"
                className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
                  imageFileUploadProgress &&
                  imageFileUploadProgress < 100 &&
                  "opacity-60"
                }`}
              />
            </div>
            {imageFileUploadError && (
              <Alert className="text-red-400 mx-auto text-xs">
                {imageFileUploadError}
              </Alert>
            )}
            <div className="flex flex-col sm:flex-row gap-5 mt-5">
              <div className="flex-1 flex flex-col gap-3">
                <div>
                  <Label
                    value="Username"
                    className="text-cgreen text-sm font-normal"
                  />
                  <TextInput
                    type="text"
                    placeholder="Enter your username"
                    id="username"
                    defaultValue={currentUser.username}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label
                    value="Email"
                    className="text-cgreen text-sm font-normal"
                  />
                  <TextInput
                    type="email"
                    placeholder="Enter your email"
                    id="email"
                    defaultValue={currentUser.email}
                    readOnly
                    disabled
                  />
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-3">
                <div>
                  <Label
                    value="New Password"
                    className="text-cgreen text-sm font-normal"
                  />
                  <TextInput
                    type="password"
                    placeholder="Enter your password"
                    id="newpassword"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label
                    value="Confirm New Password"
                    className="text-cgreen text-sm font-normal"
                  />
                  <TextInput
                    type="password"
                    placeholder="Confirm password"
                    id="confirmpassword"
                    onChange={handleChange}
                    disabled={formData.newpassword ? false : true}
                  />
                </div>
                <div>
                  <Label
                    value="Current Password"
                    className="text-cgreen text-sm font-normal"
                  />
                  <TextInput
                    type="password"
                    placeholder="Enter your password"
                    id="curpassword"
                    onChange={handleChange}
                    disabled={
                      Object.keys(formData).length === 0 ||
                      (formData.newpassword === "" &&
                        formData.username === currentUser.username)
                        ? true
                        : false
                    }
                  />
                </div>
              </div>
            </div>
            <div className="flex hover:shadow-lg bg-black rounded-xl mt-5 w-full sm:w-1/2 mx-auto">
              <Button
                className="bg-cbrown text-clight font-semibold flex-1"
                type="submit"
              >
                Update
              </Button>
            </div>
            {/* <div className="flex hover:shadow-lg rounded-xl w-1/2 mx-auto">
            <Button
              type="button"
              className="inner-border-cbrown bg-clight inner-border-solid inner-border-2 flex-1 mt-2"
              // disabled
              onClick={handleCancel}
            >
              <span className="text-cbrown font-semibold">Cancel</span>
            </Button>
          </div> */}
          </form>
          <div className=" text-sm text-cbrown underline flex justify-between mt-2 w-full sm:w-1/2 mx-auto">
            <span
              className="cursor-pointer"
              onClick={() => dispatch(showDeleteModal())}
            >
              Delete Account
            </span>
            <span onClick={handleSignout} className="cursor-pointer">
              Sign Out
            </span>
          </div>
          {updateUserSuccess && (
            <div className="flex place-content-center">
              <Alert className="text-green-400">{updateUserSuccess}</Alert>
            </div>
          )}
          {updateUserError && (
            <div className="flex place-content-center">
              <Alert className="text-red-400">{updateUserError}</Alert>
            </div>
          )}
          <DeleteUserModal />
        </div>
      </div>
    </div>
  );
}
