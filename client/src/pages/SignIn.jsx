import React, { useState } from "react";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import {
  addToSavedCounterargs,
  resetSavedCounterargs,
} from "../redux/counterargument/counterargSlice";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill out all fields!"));
    }

    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }
      if (res.ok) {
        dispatch(signInSuccess(data));
        dispatch(resetSavedCounterargs());
        for (let i = 0; i < data.saved.length; i++) {
          if (data.saved[i].topicName === "default") {
            for (let j = 0; j < data.saved[i].counterarguments.length; j++) {
              dispatch(
                addToSavedCounterargs(data.saved[i].counterarguments[j])
              );
            }
          }
        }
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="bg-clight text-cgreen cshadow w-full sm:w-[30rem] rounded-md self-center flex-col mx-5 sm:mx-auto mt-7">
      <div className="mt-5 flex ">
        <span className="font-black text-3xl m-auto">Sign in</span>
      </div>
      <div className="my-5 mx-3 sm:mx-10">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <Label value="Email" className="text-cgreen text-sm font-normal" />
            <TextInput
              type="email"
              placeholder="Enter your email"
              id="email"
              onChange={handleChange}
            />
          </div>
          <div>
            <Label
              value="Password"
              className="text-cgreen text-sm font-normal"
            />
            <TextInput
              type="password"
              placeholder="Enter your password"
              id="password"
              onChange={handleChange}
            />
          </div>
          <div className="flex hover:shadow-lg bg-black rounded-xl mt-5">
            <Button
              className="bg-cbrown text-clight font-semibold flex-1"
              type="submit"
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </div>
          <OAuth page={"Sign in"} />
        </form>
        <div className="flex gap-2 text-sm mt-5 place-content-center">
          <span>Don't have an account?</span>
          <Link
            to="/sign-up"
            className="text-cbrown underline underline-offset-2"
          >
            Sign Up
          </Link>
        </div>
        <div className="flex place-content-center">
          {errorMessage && (
            <Alert className="text-red-400">{errorMessage}</Alert>
          )}
        </div>
      </div>
    </div>
  );
}
