import React, { useEffect, useRef, useState } from "react";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import { Spinner, TextInput } from "flowbite-react";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import AppLogo from "../assets/logo.png";
import PopupCounterargsContainer from "../components/PopupCounterargContainer";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Prompt from "../components/Prompt";

const WindowPopup = () => {
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const [counterarguments, setCounterarguments] = useState([]);
  const [claimEdit, setClaimEdit] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingPrompt, setLoadingPrompt] = useState(null);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const selectedClaim = useRef("");
  const location = useLocation();
  const homepageRoute = "http://localhost:5173/";
  const signinRoute = "http://localhost:5173/sign-in";
  const signupRoute = "http://localhost:5173/sign-up";
  const { prompt, promptText } = useSelector((state) => state.counterarg);
  const charLimit = 500;

  useEffect(() => {
    if (currentUser) {
      selectedClaim.current = new URLSearchParams(location.search).get(
        "selectedText"
      );
      setClaimEdit(selectedClaim.current);
      generateCounterarguments();
    }
  }, []);

  const handleChange = (e) => {
    setClaimEdit(e.target.value);
    selectedClaim.current = e.target.value;
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
      if (!selectedClaim.current) {
        setError("Please select something!");
        setLoadingPrompt(null);
        setLoading(false);
        setCounterarguments([]);
        return;
      }

      if (selectedClaim.current.length > charLimit) {
        setError(`Please input up to ${charLimit} characters only.`);
        setLoadingPrompt(null);
        setLoading(false);
        setCounterarguments([]);
        return;
      }

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
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const chat = model.startChat({
        generationConfig: {
          maxOutputTokens: 2048,
        },
        safetySettings,
      });

      const claim = `${selectedClaim.current}`;

      setLoadingPrompt("Assessing the input...");
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
          setLoadingPrompt("Identifying the type of claim...");
          const askCategoryPrompt = `
          Categorize the sentence "${claim}" into seven categories:
  
          1. Personal experience (PE): Claims that aren't capable of being checked using publicly-available information, e.g. "I can't save for a deposit."
          2. Quantity in the past or present (Q): Current value of something e.g. "1 in 4 wait longer than 6 weeks to be seen by a doctor." Changing quantity, e.g. "The Coalition Government has created 1,000 jobs for every day it's been in office." Comparison, e.g. "Free schools are outperforming state schools.". Ranking, e.g. "The UK's the largest importer from the Eurozone."
          3. Correlation or causation (CC): Correlation e.g. "GCSEs are a better predictor than AS if a student will get a good degree." Causation, e.g. "Tetanus vaccine causes infertility." Absence of a link, e.g. "Grammar schools don't aid social mobility."
          4. Current laws or rules of operation (CLO): Declarative sentences, which generally have the word "must" or legal terms, e.g. "The UK allows a single adult to care for fewer children than other European countries." Procedures of public institutions, e.g. "Local decisions about commissioning services are now taken by organisations that are led by clinicians." Rules and changes, e.g. "EU residents cannot claim Jobseeker's Allowance if they have been in the country for 6 months and have not been able to find work."
          5. Prediction (P): Hypothetical claims about the future e.g. "Indeed, the IFS says that school funding will have fallen by 5% in real terms by 2019 as a result of government policies."
          6. Other type of claim (OTC): Voting records e.g "You voted to leave, didn't you?" Public Opinion e.g "Public satisfaction with the NHS in Wales is lower than it is in England." Support e.g. "The party promised free childcare" Definitions, e.g. "Illegal killing of people is what's known as murder." Any other sentence that you think is a claim.
          7. Not a claim (NAC): These are sentences that don't fall into any categories and aren't claims. e.g. "What do you think?.", "Questions to the Prime Minister!"
          
          Strictly use only one of the 7 labels (PE, Q, CC, CLO, P, OTC, NAC), do not provide any additional explanation.
          `;
          const askCategoryPromptResult = await chat.sendMessage(
            askCategoryPrompt
          );
          const askCategoryPromptResponse =
            askCategoryPromptResult.response.text();
          console.log("Category? " + askCategoryPromptResponse);

          if (
            askCategoryPromptResponse.toLowerCase().includes("pe") ||
            askCategoryPromptResponse.toLowerCase().includes("nac")
          ) {
            setError("The input is not suitable for counterarguments.");
            setLoadingPrompt(null);
            setLoading(false);
            setCounterarguments([]);
            return;
          }
        } else {
          setError("The input is neither a claim nor an argument.");
          setLoadingPrompt(null);
          setLoading(false);
          setCounterarguments([]);
          return;
        }
      }

      setLoadingPrompt("Generating counterarguments...");
      const msgs = [
        `Please provide one argument against "${claim}" strictly with summary (in paragraph form labeled as **Summary:**), body (in paragraph form labeled as **Body:**), and source (in bullet points labeled as **Source:**) as the format. The argument should be well-structured and organized in a coherent manner.
        
        Please make sure that the argument will refute "${claim}" and not support it.`,
        `Please provide another argument against "${claim}" strictly with summary (in paragraph form labeled as **Summary:**), body (in paragraph form labeled as **Body:**), and source (in bullet points labeled as **Source:**) as the format. The argument should be well-structured and organized in a coherent manner.
        
        Please make sure that the argument will refute "${claim}" and not support it.`,
        `Again, please provide another argument against "${claim}" strictly with summary (in paragraph form labeled as **Summary:**), body (in paragraph form labeled as **Body:**), and source (in bullet points labeled as **Source:**) as the format. The argument should be well-structured and organized in a coherent manner.
        
        Please make sure that the argument will refute "${claim}" and not support it.`,
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
        setLoadingPrompt(`Generated ${i + 1}/3 counterarguments...`);
      }

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
      setLoadingPrompt(null);
      setLoading(false);
      setError(null);
    } catch (error) {
      setLoadingPrompt(null);
      setLoading(false);
      setCounterarguments([]);
      setError("Counterargument generation failed! Please try again.");
      console.log(error.message);
    }
  };

  return (
    <div className="window-popup flex w-screen h-screen">
      <div className="m-auto p-2 bg-clight w-[600px] h-[580px] rounded cshadow">
        {currentUser ? (
          <>
            <div className="flex gap-1">
              <Link
                to={homepageRoute}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={AppLogo} className="h-10 w-15 hover:cursor-pointer" />
              </Link>
              <div className="flex-1 text-cgreen text-left m-auto font-bold text-lg">
                <Link
                  to={homepageRoute}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="hover:cursor-pointer">ArguSure</span>
                </Link>
              </div>
            </div>
            <div>
              <div className="flex gap-2">
                <div className="flex items-center justify-center mt-2 ml-2 text-cblack text-sm font-bold">
                  Input:
                </div>
                <div className="flex-1 h-14 w-2/3 p-1 mt-2 bg-clightgreen rounded shadow-lg">
                  <div className="flex gap-1 h-full">
                    {editing ? (
                      <form
                        className="flex-1 mt-1"
                        onSubmit={(e) => {
                          e.preventDefault();
                          setEditing(false);
                          generateCounterarguments();
                        }}
                      >
                        <TextInput
                          type="text"
                          placeholder="Enter to edit"
                          onChange={handleChange}
                          value={claimEdit}
                          maxLength={charLimit}
                        />
                      </form>
                    ) : (
                      <div className="flex flex-1 h-full pl-2 text-cblack text-sm font-semibold items-center">
                        <span className="line-clamp-2">
                          {selectedClaim.current}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {loading ? (
                  <span className="text-cbrown m-auto hover:cursor-not-allowed">
                    <MdOutlineDriveFileRenameOutline size={20} />
                  </span>
                ) : (
                  <span
                    className="text-cbrown m-auto hover:cursor-pointer hover:text-yellow-800"
                    onClick={() => setEditing(!editing)}
                  >
                    <MdOutlineDriveFileRenameOutline size={20} />
                  </span>
                )}
              </div>
            </div>
            <div className="flex m-2">
              <div className="flex-1"></div>
              <div className="flex gap-3 text-cbrown text-xs justify-center underline mt-1">
                {counterarguments.length !== 0 &&
                  (loading ? (
                    <span className="hover:cursor-not-allowed">Regenerate</span>
                  ) : (
                    <span
                      className="hover:cursor-pointer hover:text-yellow-800"
                      onClick={() => generateCounterarguments()}
                    >
                      Regenerate
                    </span>
                  ))}
                <Link
                  to={homepageRoute}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="hover:cursor-pointer hover:text-yellow-800">
                    Go to homepage
                  </span>
                </Link>
              </div>
            </div>
            <div className="h-[26.5rem] w-full overflow-auto mt-2 p-1 border-2 border-gray-200">
              <div className="flex-1 text-sm text-center font-bold text-cblack mt-1">
                Why this might be wrong?
              </div>
              {error ? (
                <div className="text-center mt-16 text-red-500">{error}</div>
              ) : (
                <></>
              )}
              <div className="text-cblack">
                {loading ? (
                  <div className="w-full mt-16 text-center">
                    <Spinner className="size-7 fill-cgreen mr-2" />
                    <span className="text-base text-cgreen font-bold">
                      {loadingPrompt}
                    </span>
                  </div>
                ) : counterarguments.length !== 0 ? (
                  <div>
                    {counterarguments.map((counterargument, index) => {
                      return (
                        <PopupCounterargsContainer
                          key={index}
                          counterargument={counterargument}
                          withClaim={false}
                        />
                      );
                    })}
                  </div>
                ) : (
                  !error && (
                    <div className="text-center mt-5">
                      No Counterarguments Generated
                    </div>
                  )
                )}
              </div>
            </div>
            {prompt && promptText && <Prompt promptText={promptText} />}
          </>
        ) : (
          <div className="landing-page flex flex-col gap-10 text-center w-full h-full py-16 px-5 overflow-hidden">
            <div className="text-4xl text-cgreen font-extrabold z-10">
              ArguSure
            </div>
            <div className="text-cblack italic z-10 leading-8">
              You are browsing the Internet and you read something you agree
              with. You think that that is correct, but are you sure? To
              maintain an impartial and objective stance, it might be beneficial
              for you to think again. After all, you are probably in a{" "}
              <a
                className="underline"
                href="https://www.google.com/search?q=Filter+Bubble&rlz=1C1KNTJ_enPH1072PH1072&oq=Filter+Bubble&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIGCAEQRRg9MgYIAhBFGD0yBggDEEUYPdIBCDI2NTRqMGoxqAIAsAIA&sourceid=chrome&ie=UTF-8"
                target="_blank"
              >
                Filter Bubble
              </a>
              . No worries though, <b>ArguSure</b> is here to help! Powered by
              Google's multimodal LLM called Gemini, it is a counterargument
              generator that lets you conveniently seek and explore different,
              contradictory ideas.
            </div>
            <div className="gap-3 z-10  w-full justify-center text-cblack font-bold">
              Need to{" "}
              <Link to={signinRoute} target="_blank" rel="noopener noreferrer">
                <span className="text-cbrown underline hover:cursor-pointer">
                  Sign in
                </span>
              </Link>{" "}
              or{" "}
              <Link to={signupRoute} target="_blank" rel="noopener noreferrer">
                <span className="text-cbrown underline hover:cursor-pointer">
                  Sign up
                </span>
              </Link>{" "}
              first
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WindowPopup;
