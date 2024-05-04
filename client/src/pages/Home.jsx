import React, { useRef, useState } from "react";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
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
  const currentInput = useRef("");
  const charLimit = 500;

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
      if (inputClaim.length > charLimit) {
        setError(`Please input up to ${charLimit} characters only.`);
        setLoading(false);
        setCounterarguments([]);
        return;
      }

      currentInput.current = inputClaim;
      setError(null);
      setLoading(true);
      const safetySettings = [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ];
      const model = genAI.getGenerativeModel({
        model: "gemini-pro",
      });

      const chat = model.startChat({
        generationConfig: {
          maxOutputTokens: 4096,
        },
        safetySettings,
      });
      const claim = `${inputClaim}`;

      const askArgMsg = `Strictly yes or no, is "${claim}" an argument? Please note that an argument is a coherent series of reasons, statements, or facts intended to support or establish a point of view.`;
      const askArgMsgResult = await chat.sendMessage(askArgMsg);
      const askArgMsgResponse = askArgMsgResult.response.text();
      console.log("Is an argument? " + askArgMsgResponse);

      if (askArgMsgResponse.toLowerCase().includes("no")) {
        const askClaimMsg = `Strictly yes or no, is "${claim}" a claim? Please note that a claim is an assertion open to challenge.`;
        const askClaimMsgResult = await chat.sendMessage(askClaimMsg);
        const askClaimMsgResponse = askClaimMsgResult.response.text();
        console.log("Is a claim? " + askClaimMsgResponse);

        if (askClaimMsgResponse.toLowerCase().includes("yes")) {
          const askCategoryPrompt = `
          Categorize the sentence "${claim}" into seven categories:
  
          1. Personal experience: Claims that aren't capable of being checked using publicly-available information, e.g. "I can't save for a deposit."
          2. Quantity in the past or present: Current value of something e.g. "1 in 4 wait longer than 6 weeks to be seen by a doctor." Changing quantity, e.g. "The Coalition Government has created 1,000 jobs for every day it's been in office." Comparison, e.g. "Free schools are outperforming state schools.". Ranking, e.g. "The UK's the largest importer from the Eurozone."
          3. Correlation or causation: Correlation e.g. "GCSEs are a better predictor than AS if a student will get a good degree." Causation, e.g. "Tetanus vaccine causes infertility." Absence of a link, e.g. "Grammar schools don't aid social mobility."
          4. Current laws or rules of operation: Declarative sentences, which generally have the word "must" or legal terms, e.g. "The UK allows a single adult to care for fewer children than other European countries." Procedures of public institutions, e.g. "Local decisions about commissioning services are now taken by organisations that are led by clinicians." Rules and changes, e.g. "EU residents cannot claim Jobseeker's Allowance if they have been in the country for 6 months and have not been able to find work."
          5. Prediction: Hypothetical claims about the future e.g. "Indeed, the IFS says that school funding will have fallen by 5% in real terms by 2019 as a result of government policies."
          6. Other type of claim: Voting records e.g "You voted to leave, didn't you?" Public Opinion e.g "Public satisfaction with the NHS in Wales is lower than it is in England." Support e.g. "The party promised free childcare" Definitions, e.g. "Illegal killing of people is what's known as murder." Any other sentence that you think is a claim.
          7. Not a claim: These are sentences that don't fall into any categories and aren't claims. e.g. "What do you think?.", "Questions to the Prime Minister!"
          
          Use only one of the 7 labels, do not provide any additional explanation.
          `;
          const askCategoryPromptResult = await chat.sendMessage(
            askCategoryPrompt
          );
          const askCategoryPromptResponse =
            askCategoryPromptResult.response.text();
          console.log("Category? " + askCategoryPromptResponse);

          if (
            askCategoryPromptResponse
              .toLowerCase()
              .includes("personal experience") ||
            askCategoryPromptResponse.toLowerCase().includes("not a claim")
          ) {
            setError("The input is not suitable for counterarguments.");
            setLoading(false);
            setCounterarguments([]);
            return;
          }
        } else {
          setError("The input is neither a claim nor an argument.");
          setLoading(false);
          setCounterarguments([]);
          return;
        }
      }

      const msgs = [
        `Provide one argument against "${claim}" strictly with summary (in paragraph form labeled as **Summary:**), body (in paragraph labeled as **Body:**), and source (in bullet points labeled as **Source:**) as the format.`,
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
          claim.trim(),
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
    <div className="home-page w-full h-full mt-20 ml-60">
      <div className="home-input flex flex-col sm:flex-row gap-1 sm:gap-3 justify-center">
        <Textarea
          placeholder="Enter a claim or an argument"
          className="home-textarea w-full sm:w-96 max-h-40 min-h-16"
          id="inputclaim-area"
          onChange={handleChange}
          maxLength={charLimit}
        />
        <Button
          className="bg-cbrown text-clight font-semibold w-44 h-10 mt-2 mx-auto sm:mx-0 hover:shadow-lg"
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
        ) : counterarguments.length !== 0 ? (
          <div>
            <div className="w-full mt-5 text-center text-lg font-bold text-cblack">
              Why this might be wrong?
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
        ) : (
          <div className="flex flex-col gap-10 m-auto text-center w-full sm:w-[40rem] my-10">
            <div className="text-4xl text-cgreen font-extrabold">
              Lorem Ipsum Dolor
            </div>
            <div className="text-cblack italic">
              ..... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              sodales velit vulputate magna euismod, vel maximus quam aliquam.
              Nulla eu sem vitae metus fringilla fermentum. Integer ante tortor,
              dictum a augue eget, efficitur tristique tellus. Quisque pretium
              feugiat blandit. Nam scelerisque rutrum dolor eget finibus.
              Vivamus nec nisl ultrices, auctor ante vitae, lacinia lorem.
              Aenean ullamcorper tristique ullamcorper. Vestibulum finibus erat
              nibh, nec mollis nisl eleifend non .....
            </div>
          </div>
        )}
      </div>
      <div></div>
    </div>
  );
}
