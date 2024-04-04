import React, { useEffect, useState } from "react";
import { Button, Spinner, TextInput } from "flowbite-react";
import CounterargsContainer from "../components/CounterargsContainer";
import SkeletonLoader from "../components/SkeletonLoader";

export default function Liked() {
  const [inputSearch, setinputSearch] = useState("");
  const [counterarguments, setCounterarguments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setinputSearch(e.target.value);
  };

  const handleSearch = async () => {
    try {
    } catch (error) {
      setSearchLoading(false);
      setCounterarguments([]);
      setError("Search failed! Please try again.");
      console.log(error.message);
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchLikes = async () => {
      try {
        const res = await fetch("api/counterarg/getlikes");
        const data = await res.json();
        if (res.ok) {
          setCounterarguments(data);
          setSearchLoading(false);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        setSearchLoading(false);
        setError(error);
        console.log(error);
      }
    };
    fetchLikes();
  }, []);

  return (
    <div className="w-full h-full mt-20 ml-60">
      <div className="search-input flex gap-3 justify-center">
        <TextInput
          type="text"
          placeholder="Search"
          className="w-96 max-h-40 min-h-16"
          onChange={handleChange}
        />
        <Button
          className="bg-cbrown text-clight font-semibold w-44 h-10 hover:shadow-lg"
          type="button"
          onClick={handleSearch}
          disabled={inputSearch && !searchLoading ? false : true}
        >
          {searchLoading ? (
            <>
              <Spinner size="sm" />
              <span className="pl-3">Searching...</span>
            </>
          ) : (
            "Search"
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
              Liked Counterarguments
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
            <div className="my-5 w-full text-center text-base underline text-cbrown hover:cursor-pointer">
              Show more
            </div>
          </div>
        ) : (
          <div className="w-full mt-5 text-center text-lg font-bold text-cblack">
            No liked counterarguments yet!
          </div>
        )}
      </div>
    </div>
  );
}
