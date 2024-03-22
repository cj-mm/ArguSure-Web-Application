import { Alert, Button, Label, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const filePickerRef = useRef();

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
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
        });
      }
    );
  };

  return (
    <div className="bg-clight text-cgreen shadow-2xl w-3/4 lg:w-1/2 rounded-md self-center flex-col mx-auto mt-7">
      <div className="mt-5 flex ">
        <Link to="/">
          <svg
            className="w-5 h-5 text-cbrown cursor-pointer absolute ml-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 8 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 1 1.3 6.326a.91.91 0 0 0 0 1.348L7 13"
            />
          </svg>
        </Link>
        <span className="font-black text-3xl m-auto">Profile</span>
      </div>
      <div className="my-5 mx-10">
        <form className="flex flex-col">
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
          <div className="flex gap-5 mt-5">
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
                />
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-3">
              <div>
                <Label
                  value="Current Password"
                  className="text-cgreen text-sm font-normal"
                />
                <TextInput
                  type="password"
                  placeholder="Enter your password"
                  id="currentpassword"
                />
              </div>
              <div>
                <Label
                  value="New Password"
                  className="text-cgreen text-sm font-normal"
                />
                <TextInput
                  type="password"
                  placeholder="Enter your password"
                  id="newpassword"
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
                  id="confirmnewpassword"
                />
              </div>
            </div>
          </div>
          <div className="flex hover:shadow-lg bg-black rounded-xl mt-5 w-1/2 mx-auto">
            <Button
              className="bg-cbrown text-clight font-semibold flex-1"
              type="submit"
            >
              Update
            </Button>
          </div>
          <div className="flex hover:shadow-lg rounded-xl w-1/2 mx-auto">
            <Button
              type="button"
              className="inner-border-cbrown bg-clight inner-border-solid inner-border-2 flex-1 mt-2"
            >
              <span className="text-cbrown font-semibold">Cancel</span>
            </Button>
          </div>
        </form>
        <div className=" text-sm text-cbrown underline flex justify-between mt-2 w-1/2 mx-auto">
          <span className="cursor-pointer">Delete Account</span>
          <span className="cursor-pointer">Sign Out</span>
        </div>
      </div>
    </div>
  );
}
