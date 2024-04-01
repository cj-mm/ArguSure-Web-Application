import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Button, Textarea } from "flowbite-react";
import CounterargsContainer from "../components/CounterargsContainer";

export default function Home() {
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const [inputClaim, setInputClaim] = useState("");
  const [counterarguments, setCounterarguments] = useState([]);

  const handleChange = (e) => {
    setInputClaim(e.target.value);
  };

  const generateCounterarguments = async () => {
    if (!inputClaim) {
      return;
    }
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
      const summaryPos = text.indexOf("**Summary:**");
      const bodyPos = text.indexOf("**Body:**");
      const sourcePos = text.indexOf("**Source:**");
      const summary = text.substring(summaryPos + 12, bodyPos);
      const body = text.substring(bodyPos + 9, sourcePos);
      const source = text.substring(sourcePos + 11);
      const counterarg = { summary, body, source };
      counterargs.push(counterarg);
    }
    setCounterarguments(counterargs);
  };

  const tempArray = ["HEHHEE", "HEHHEE", "HEHHEE", "HEHHEE", "HEHHEE"];

  return (
    <div className="w-full h-full mt-20 ml-60">
      <div className="home-input flex gap-3 justify-center">
        <Textarea
          placeholder="Enter an argument"
          className="w-96 max-h-40 min-h-16"
          onChange={handleChange}
        />
        <Button
          className="bg-cbrown text-clight font-semibold w-44 h-10 mt-2 hover:shadow-lg"
          type="button"
          onClick={generateCounterarguments}
        >
          Generate
        </Button>
      </div>
      <div>
        {counterarguments.length !== 0 &&
          counterarguments.map((counterargument, index) => {
            return (
              <CounterargsContainer
                key={index}
                counterargument={counterargument}
              />
            );
          })}
      </div>
      <div></div>
    </div>
  );
}
