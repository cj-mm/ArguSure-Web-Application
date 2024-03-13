import React from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <div className="bg-clight text-cgreen shadow-2xl w-3/4 lg:w-1/3 rounded-md self-center flex-col mx-auto mt-7">
      <div className="mt-5 flex ">
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
        <span className="font-black text-3xl m-auto">Sign up</span>
        {/* <div className="right flex-1"></div> */}
      </div>
      <div className="my-5 mx-10">
        <form className="flex flex-col gap-4 ">
          <div>
            <Label
              value="First Name"
              className="text-cgreen text-sm font-normal"
            />
            <TextInput
              type="text"
              placeholder="Enter your first name"
              id="firstname"
              className="text-cbrown"
            />
          </div>
          <div>
            <Label
              value="Last Name"
              className="text-cgreen text-sm font-normal"
            />
            <TextInput
              type="text"
              placeholder="Enter your last name"
              id="lastname"
            />
          </div>
          <div>
            <Label value="Email" className="text-cgreen text-sm font-normal" />
            <TextInput type="text" placeholder="Enter your email" id="email" />
          </div>
          <div>
            <Label
              value="Password"
              className="text-cgreen text-sm font-normal"
            />
            <TextInput
              type="text"
              placeholder="Enter your password"
              id="password"
            />
          </div>
          <div>
            <Label
              value="Confirm Password"
              className="text-cgreen text-sm font-normal"
            />
            <TextInput
              type="text"
              placeholder="Confirm password"
              id="confirmpassword"
            />
          </div>
          <Button
            className="bg-cbrown text-clight font-semibold mt-5"
            type="submit"
          >
            Sign Up
          </Button>
        </form>
        <div className="flex gap-2 text-sm mt-5 place-content-center">
          <span>Already have an account?</span>
          <Link
            to="/sign-in"
            className="text-cbrown underline underline-offset-2"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
