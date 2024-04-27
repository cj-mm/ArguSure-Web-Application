import React from "react";
import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInSuccess } from "../redux/user/userSlice";
import { useGoogleLogin } from "@react-oauth/google";

export default function GoogleAuth({ page }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const resultsFromGoogle = await userInfo.json();
        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: resultsFromGoogle.name,
            email: resultsFromGoogle.email,
            googlePhotoUrl: resultsFromGoogle.picture,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          dispatch(signInSuccess(data));
          navigate("/");
        }
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <div className="flex hover:shadow-lg rounded-xl">
      <Button
        type="button"
        onClick={() => handleGoogleAuth()}
        className="inner-border-cbrown bg-clight inner-border-solid inner-border-2 flex-1"
      >
        <AiFillGoogleCircle className="w-6 h-6 mr-2 text-cbrown" />
        <span className="text-cbrown font-semibold">{page} with Google</span>
      </Button>
    </div>
  );
}
