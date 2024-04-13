import React, { useEffect, useState } from "react";
import Search from "../components/Search";
import { FaPlusSquare, FaArrowLeft } from "react-icons/fa";
import {
  MdOutlineDriveFileRenameOutline,
  MdDeleteOutline,
} from "react-icons/md";

import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Spinner } from "flowbite-react";
import AddTopic from "../components/AddTopic";
import { showAddTopic } from "../redux/counterargument/counterargSlice";

export default function Topics() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const data = getTopics(searchTermFromUrl);
    setTopics(data);
    setLoading(false);
  }, [location.search, currentUser]);

  const getTopics = (searchTermFromUrl) => {
    const userSaved = currentUser.saved;
    const tempTopics = userSaved.slice(1, userSaved.length); // remove default
    let resultTopics = [];

    if (searchTermFromUrl) {
      for (let i = 0; i < tempTopics.length; i++) {
        if (
          tempTopics[i].topicName
            .toLowerCase()
            .includes(searchTermFromUrl.toLowerCase())
        ) {
          resultTopics.push(tempTopics[i]);
        }
      }
    } else {
      resultTopics = tempTopics;
    }
    return resultTopics;
  };

  const handleGoBack = () => {
    navigate("/saved/topics");
  };

  return (
    <div className="flex flex-col w-full h-full mt-20 ml-60">
      <div className="flex gap-1 w-[60rem] m-auto mb-5 text-cbrown ">
        <FaArrowLeft
          className="size-7 hover:cursor-pointer hover:text-yellow-800"
          onClick={() => navigate("/saved")}
        />
        <div className="flex-1">
          <div className="w-full text-center text-lg font-bold text-cblack">
            Topic List
          </div>
        </div>
        <FaPlusSquare
          className="size-7 hover:cursor-pointer hover:text-yellow-800"
          onClick={() => dispatch(showAddTopic())}
        />
      </div>
      <Search pageRoute={"saved/topics"} />
      {error ? (
        <div className="text-center mt-5 text-red-500">{error}</div>
      ) : (
        <></>
      )}
      {loading ? (
        <div className="flex m-auto">
          <Spinner
            color="success"
            aria-label="Default status example"
            size="xl"
          />
        </div>
      ) : topics.length !== 0 ? (
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
                  {"<"} Go back to all created topics
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="grid grid-cols-3 grid-flow-row gap-4 w-[60rem] m-auto mt-5 mb-5">
            {topics.map((topic, index) => {
              return (
                <div
                  className="bg-clightgreen cshadow rounded flex gap-1 items-center  hover:cursor-pointer h-14 p-2"
                  key={index}
                >
                  <span className="text-cblack font-bold truncate w-3/4">
                    {topic.topicName}
                  </span>
                  <div className="flex-1"></div>
                  <MdOutlineDriveFileRenameOutline className="size-5 text-clight hover:text-cbrown" />
                  <MdDeleteOutline className="size-5 text-clight hover:text-red-400" />
                </div>
              );
            })}
          </div>
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
                {"<"} Go back to all created topics
              </div>
            </div>
          ) : (
            "No created topics yet!"
          )}
        </div>
      )}
      <AddTopic />
    </div>
  );
}
