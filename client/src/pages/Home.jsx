import React, { useRef, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Button, Spinner, Textarea } from "flowbite-react";
import CounterargsContainer from "../components/CounterargsContainer";
import SkeletonLoader from "../components/SkeletonLoader";

export default function Home() {
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const [inputClaim, setInputClaim] = useState("");
  const [counterarguments, setCounterarguments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [currentInput, setCurrentInput] = useState("");
  const currentInput = useRef("");

  const handleChange = (e) => {
    setInputClaim(e.target.value);
  };

  const handleRecord = async (claim, summary, body, source) => {
    const counterargData = { inputClaim: claim, summary, body, source };
    try {
      const res = await fetch("/api/counterarg/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(counterargData),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
      } else {
        setError(null);
        return data;
      }
    } catch (error) {
      setError("Something went wrong");
    }
  };

  const generateCounterarguments = async () => {
    try {
      if (!inputClaim) {
        setError("Please input something!");
        setLoading(false);
        setCounterarguments([]);
        return;
      }
      currentInput.current = inputClaim;
      setError(null);
      setLoading(true);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const chat = model.startChat({
        // history: [
        //   {
        //     role: "user",
        //     parts: "Hello!",
        //   },
        //   {
        //     role: "model",
        //     parts: "Great to meet you. What would you like to know?",
        //   },
        // ],
        generationConfig: {
          maxOutputTokens: 4096,
        },
      });

      const claim = `'${inputClaim}'`;

      const msgs = [
        "Provide one argument against " +
          claim +
          " strictly with summary (in paragraph form), body (in paragraph form), and source as the format",
        "Provide another one with the same format",
        "Provide another one again with the same format",
      ];
      const numOfCounterarguments = 3;
      let counterargs = [];
      for (let i = 0; i < numOfCounterarguments; i++) {
        const msg = msgs[i];
        const result = await chat.sendMessage(msg);
        const response = await result.response;
        const text = response.text();
        console.log(text);
        const summaryPos = text.indexOf("**Summary:**");
        const bodyPos = text.indexOf("**Body:**");
        const sourcePos = text.indexOf("**Source:**");
        const summary = text.substring(summaryPos + 12, bodyPos).trim();
        const body = text.substring(bodyPos + 9, sourcePos).trim();
        const source = text.substring(sourcePos + 11).trim();
        const counterarg = { summary, body, source };
        counterargs.push(counterarg);
      }
      setLoading(false);
      setError(null);

      for (let i = 0; i < counterargs.length; i++) {
        const counterarg = counterargs[i];
        const data = await handleRecord(
          claim.slice(1, -1),
          counterarg.summary,
          counterarg.body,
          counterarg.source
        );
        counterargs[i] = data;
      }

      setCounterarguments(counterargs);
    } catch (error) {
      setLoading(false);
      setCounterarguments([]);
      setError("Counterargument generation failed! Please try again.");
      console.log(error.message);
    }
  };

  return (
    <div className="w-full h-full mt-20 ml-60">
      <div className="home-input flex gap-3 justify-center">
        <Textarea
          placeholder="Enter an argument"
          className="w-96 max-h-40 min-h-16"
          id="inputclaim-area"
          onChange={handleChange}
        />
        <Button
          className="bg-cbrown text-clight font-semibold w-44 h-10 mt-2 hover:shadow-lg"
          type="button"
          onClick={generateCounterarguments}
          disabled={inputClaim && !loading ? false : true}
        >
          {loading ? (
            <>
              <Spinner size="sm" />
              <span className="pl-3">Generating...</span>
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </div>
      {error ? (
        <div className="text-center mt-5 text-red-500">{error}</div>
      ) : (
        <></>
      )}
      <div>
        {loading ? (
          <SkeletonLoader />
        ) : (
          counterarguments.length !== 0 && (
            <div>
              <div className="w-full mt-5 text-center text-lg font-bold text-cblack">
                Counterarguments:
              </div>
              {counterarguments.map((counterargument, index) => {
                return (
                  <CounterargsContainer
                    key={index}
                    counterargument={counterargument}
                    withClaim={false}
                  />
                );
              })}
              <div
                className="my-5 w-full text-center text-base underline text-cbrown hover:cursor-pointer"
                onClick={generateCounterarguments}
              >
                Regenerate
              </div>
            </div>
          )
        )}
      </div>
      <div></div>
    </div>
  );
}
