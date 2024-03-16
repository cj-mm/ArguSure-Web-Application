import React, { useState } from "react";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmpassword
    ) {
      console.log(formData);
      return setErrorMessage("Please fill out all fields!");
    }
    if (formData.password !== formData.confirmpassword) {
      return setErrorMessage("Passwords do not match!");
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const { confirmpassword, ...otherProperties } = formData;
      const formDataFinal = { ...otherProperties };

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataFinal),
      });

      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      if (res.ok) {
        navigate("/sign-in");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="bg-clight text-cgreen shadow-2xl w-3/4 lg:w-1/3 rounded-md self-center flex-col mx-auto mt-7">
      <div className="mt-5 flex ">
        <Link to="/home">
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
        <span className="font-black text-3xl m-auto">Sign up</span>
        {/* <div className="right flex-1"></div> */}
      </div>
      <div className="my-5 mx-10">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <Label
              value="Username"
              className="text-cgreen text-sm font-normal"
            />
            <TextInput
              type="text"
              placeholder="Enter your username"
              id="username"
              className="text-cbrown"
              onChange={handleChange}
            />
          </div>
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
          <div>
            <Label
              value="Confirm Password"
              className="text-cgreen text-sm font-normal"
            />
            <TextInput
              type="password"
              placeholder="Confirm password"
              id="confirmpassword"
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
                "Sign up"
              )}
            </Button>
          </div>
          <OAuth page={"Sign up"} />
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
        <div className="flex place-content-center">
          {errorMessage && (
            <Alert className="text-red-400">{errorMessage}</Alert>
          )}
        </div>
      </div>
    </div>
  );
}
