import { Button, Spinner, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Search({ pageRoute }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = (e) => {
    setSearchLoading(true);
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/${pageRoute}?${searchQuery}`);
    setSearchLoading(false);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <form onSubmit={handleSearch}>
      <div className="search-input flex gap-3 justify-center">
        <TextInput
          type="text"
          placeholder="Search"
          className="w-96 max-h-40 min-h-16"
          onChange={handleChange}
          value={searchTerm}
        />
        <Button
          className="bg-cbrown text-clight font-semibold w-44 h-10 hover:shadow-lg"
          type="submit"
          disabled={searchTerm && !searchLoading ? false : true}
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
    </form>
  );
}
