import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Button, Textarea } from "flowbite-react";

export default function Home() {
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const [inputClaim, setInputClaim] = useState("");
  const [counterarguments, setCounterarguments] = useState("");

  const handleChange = (e) => {
    setInputClaim(e.target.value);
  };

  const generateCounterarguments = async () => {
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
      "Provide one counterargument to " +
        claim +
        " strictly with summary (in paragraph form), body (in paragraph form), and source as the format",
      "Provide another counterargument with the same format",
      "Provide another counterargument again with the same format",
    ];
    const numOfCounterarguments = 3;
    var counterargs = "";
    for (let i = 0; i < numOfCounterarguments; i++) {
      const msg = msgs[i];
      const result = await chat.sendMessage(msg);
      const response = await result.response;
      const text = response.text();
      counterargs += text + "\n\n\n=====================================\n\n\n";
      setCounterarguments(counterargs);
    }
  };

  return (
    <div className="w-full h-full mt-20">
      <div className="home-input flex gap-3 justify-center">
        <Textarea
          placeholder="Enter an argument"
          className="w-96 max-h-40"
          onChange={handleChange}
        />
        <Button
          className="bg-cbrown text-clight font-semibold w-44 h-10 mt-2"
          type="button"
          onClick={generateCounterarguments}
        >
          Generate
        </Button>
      </div>
      <div>{counterarguments}</div>
      <div></div>
    </div>
  );
}
