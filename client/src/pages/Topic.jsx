import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CounterargsContainer from "../components/CounterargsContainer";
import SkeletonLoader from "../components/SkeletonLoader";
import Search from "../components/Search";
import { FaArrowLeft } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { updateSuccess } from "../redux/user/userSlice";

export default function Topic() {
  const { topicSlug } = useParams();
  const [topic, setTopic] = useState({});
  const [counterarguments, setCounterarguments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(true);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const handleShowMore = async () => {
    const startIndex = counterarguments.length;
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    try {
      const reqRoute = searchTermFromUrl
        ? `/api/saved/getsaved?topicSlug=${topicSlug}&startIndex=${startIndex}&searchTerm=${searchTermFromUrl}`
        : `/api/saved/getsaved?topicSlug=${topicSlug}&startIndex=${startIndex}`;
      const res = await fetch(reqRoute);
      const data = await res.json();
      if (res.ok) {
        setTopic(data.selectedTopic);
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
    navigate(`/saved/topics/${topicSlug}`);
  };

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const res = await fetch(`/api/user/getuser`, {
          method: "GET",
        });
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          dispatch(updateSuccess(null));
        } else {
          dispatch(updateSuccess(data));
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getCurrentUser();
    setLoading(true);
    setShowMore(true);
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const fetchSaved = async () => {
      try {
        const reqRoute = searchTermFromUrl
          ? `/api/saved/getsaved?topicSlug=${topicSlug}&searchTerm=${searchTermFromUrl}`
          : `/api/saved/getsaved?topicSlug=${topicSlug}`;
        const res = await fetch(reqRoute);
        const data = await res.json();
        if (res.ok) {
          setTopic(data.selectedTopic);
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
    <div className="w-full h-full mt-10 ml-60">
      <div className="flex gap-1 w-[60rem] m-auto mb-5 text-cbrown ">
        <FaArrowLeft
          className="size-7 hover:cursor-pointer hover:text-yellow-800"
          onClick={() => navigate("/saved/topics")}
        />
        <div className="flex-1">
          <div className="w-full text-center text-xl font-bold text-cblack">
            {topic.topicName}
          </div>
        </div>
      </div>
      <Search pageRoute={`saved/topics/${topicSlug}`} />
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
                    {"<"} Go back to all {topic.topicName} counterarguments
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
                  {"<"} Go back to all {topic.topicName} counterarguments
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
