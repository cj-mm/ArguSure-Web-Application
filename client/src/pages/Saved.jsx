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
    const topicName = "default";
    try {
      const reqRoute = searchTermFromUrl
        ? `api/saved/getsaved?topicName=${topicName}&startIndex=${startIndex}&searchTerm=${searchTermFromUrl}`
        : `api/saved/getsaved?topicName=${topicName}&startIndex=${startIndex}`;
      const res = await fetch(reqRoute);
      const data = await res.json();
      if (res.ok) {
        setCounterarguments((prev) => [...prev, ...data]);
        if (data.length < 9) {
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
    const topicName = "default";
    const fetchSaved = async () => {
      try {
        const reqRoute = searchTermFromUrl
          ? `api/saved/getsaved?topicName=${topicName}&searchTerm=${searchTermFromUrl}`
          : `api/saved/getsaved?topicName=${topicName}`;
        const res = await fetch(reqRoute);
        const data = await res.json();
        if (res.ok) {
          setCounterarguments(data);
          setLoading(false);
          if (data.length < 9) {
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
    <div className="w-full h-full mt-20 ml-60">
      <div className="w-full my-5 text-center text-lg font-bold text-cblack">
        Saved Counterarguments
      </div>
      <Search pageRoute={"saved"} />
      {error ? (
        <div className="text-center mt-5 text-red-500">{error}</div>
      ) : (
        <></>
      )}
      <div>
        <div className="flex gap-1 w-[60rem] m-auto text-cbrown justify-end">
          <FaFolderOpen className="size-5" />
          <span
            className="hover:cursor-pointer underline text-base"
            onClick={() => navigate("/saved/topics")}
          >
            Go to topic list
          </span>
        </div>
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
              "No saved counterarguments yet!"
            )}
          </div>
        )}
      </div>
    </div>
  );
}
