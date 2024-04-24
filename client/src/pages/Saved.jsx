import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CounterargsContainer from "../components/CounterargsContainer";
import SkeletonLoader from "../components/SkeletonLoader";
import Search from "../components/Search";
import { FaFolderOpen } from "react-icons/fa6";

export default function Saved() {
  const [counterarguments, setCounterarguments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleShowMore = async () => {
    const startIndex = counterarguments.length;
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const topicSlug = "default";
    try {
      const reqRoute = searchTermFromUrl
        ? `api/saved/getsaved?topicSlug=${topicSlug}&startIndex=${startIndex}&searchTerm=${searchTermFromUrl}`
        : `api/saved/getsaved?topicSlug=${topicSlug}&startIndex=${startIndex}`;
      const res = await fetch(reqRoute);
      const data = await res.json();
      if (res.ok) {
        setCounterarguments((prev) => [
          ...prev,
          ...data.orderedTopicCounterargs,
        ]);
        if (data.orderedTopicCounterargs.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      setError(error.message);
      console.log(error.message);
    }
  };

  const handleGoBack = () => {
    navigate("/saved");
  };

  useEffect(() => {
    setLoading(true);
    setShowMore(true);
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const topicSlug = "default";
    const fetchSaved = async () => {
      try {
        const reqRoute = searchTermFromUrl
          ? `api/saved/getsaved?topicSlug=${topicSlug}&searchTerm=${searchTermFromUrl}`
          : `api/saved/getsaved?topicSlug=${topicSlug}`;
        const res = await fetch(reqRoute);
        const data = await res.json();
        if (res.ok) {
          setCounterarguments(data.orderedTopicCounterargs);
          setLoading(false);
          if (data.orderedTopicCounterargs.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        setLoading(false);
        setError(error);
        console.log(error);
      }
    };
    fetchSaved();
  }, [location.search]);

  return (
    <div className="page-container w-full h-full mt-5 ml-60">
      <div className="page flex justify-between gap-1 w-[60rem] m-auto text-cbrown ">
        <div className="w-0 sm:w-1/3"></div>
        <div className="my-5 w-1/3 text-center text-base sm:text-xl font-bold text-cblack">
          Saved Counterarguments
        </div>
        <div className="flex w-1/3 gap-1 m-auto text-cbrown justify-end">
          <FaFolderOpen className="size-5" />
          <span
            className="hover:cursor-pointer underline text-sm sm:text-base"
            onClick={() => navigate("/saved/topics")}
          >
            Go to topic list
          </span>
        </div>
      </div>
      <Search pageRoute={"saved"} />
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
              {new URLSearchParams(location.search).get("searchTerm") ? (
                <div>
                  Results for "
                  {new URLSearchParams(location.search).get("searchTerm")}"
                  <div
                    className="text-sm font-normal text-cbrown underline hover:cursor-pointer"
                    onClick={handleGoBack}
                  >
                    {"<"} Go back to all saved counterarguments
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
            {counterarguments.map((counterargument, index) => {
              return (
                <CounterargsContainer
                  key={index}
                  counterargument={counterargument}
                  withClaim={true}
                />
              );
            })}
            {showMore && (
              <div
                className="my-5 w-full text-center text-base underline text-cbrown hover:cursor-pointer"
                onClick={handleShowMore}
              >
                Show more
              </div>
            )}
          </div>
        ) : (
          <div className="w-full mt-5 text-center text-lg font-bold text-cblack">
            {new URLSearchParams(location.search).get("searchTerm") ? (
              <div>
                No results
                <div
                  className="text-sm font-normal text-cbrown underline hover:cursor-pointer"
                  onClick={handleGoBack}
                >
                  {"<"} Go back to all saved counterarguments
                </div>
              </div>
            ) : (
              <div>
                No saved counterarguments yet!
                <div className="text-sm font-normal text-cbrown underline mt-1">
                  <span
                    className="hover:cursor-pointer"
                    onClick={() => navigate("/")}
                  >
                    Go to home to generate counterarguments
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
