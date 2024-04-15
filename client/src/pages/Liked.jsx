import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CounterargsContainer from "../components/CounterargsContainer";
import SkeletonLoader from "../components/SkeletonLoader";
import Search from "../components/Search";

export default function Liked() {
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
    const page = "liked";
    try {
      const reqRoute = searchTermFromUrl
        ? `api/counterarg/getcounterargs?page=${page}&startIndex=${startIndex}&searchTerm=${searchTermFromUrl}`
        : `api/counterarg/getcounterargs?page=${page}&startIndex=${startIndex}`;
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
    navigate("/liked");
  };

  useEffect(() => {
    setLoading(true);
    setShowMore(true);
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const page = "liked";
    const fetchLikes = async () => {
      try {
        const reqRoute = searchTermFromUrl
          ? `api/counterarg/getcounterargs?page=${page}&searchTerm=${searchTermFromUrl}`
          : `api/counterarg/getcounterargs?page=${page}`;
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
    fetchLikes();
  }, [location.search]);

  return (
    <div className="w-full h-full mt-5 ml-60">
      <div className="w-full my-5 text-center text-lg font-bold text-cblack">
        Liked Counterarguments
      </div>
      <Search pageRoute={"liked"} />
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
                    {"<"} Go back to all liked counterarguments
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
                  {"<"} Go back to all liked counterarguments
                </div>
              </div>
            ) : (
              <div>
                No liked counterarguments yet!
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
