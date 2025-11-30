"use client";

import Image from "next/image";
import SearchInput from "./SearchInput";
import { FaUserCircle, FaBell } from "react-icons/fa";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

const Header = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchSearchSuggestions = async () => {
      try {
        const { data, error } = await supabase
          .from("searchSuggestions")
          .select("name");

        if (error) throw error;

        const suggestions = data?.map((item) => item.name) || [];
        setSearchResults(suggestions);
      } catch (error) {
        console.error("Error fetching search suggestions:", error);
        setSearchResults([]);
      }
    };

    fetchSearchSuggestions();
  }, []);

  return (
    <header className="w-full bg-gray-50 text-gray-900 shadow-md p-2 rounded-b-xl flex items-center justify-center relative transition-all duration-300 ease-in-out">
      {/* Search bar (left side) */}
      <div className="absolute left-0 p-2">
        <SearchInput
          open={searchOpen}
          setOpen={setSearchOpen}
          query={searchQuery}
          setQuery={setSearchQuery}
          results={searchResults}
        />
      </div>

      {/* Center logo */}
      <div className="flex-1 flex justify-center">
        <Image
          src="/images/logojobsyc2png.png"
          alt="JobSyc Logo"
          width={50}
          height={50}
          className="cursor-pointer rounded-full hover:opacity-90 transition-opacity duration-200"
        />
      </div>

      {/* Right side icons */}
      <div className="absolute right-0 p-2 flex gap-5">
        <FaBell className="text-2xl cursor-pointer text-[#2A4D7A] hover:text-[#6f92c7] transition-transform duration-200" />
        <FaUserCircle className="text-2xl cursor-pointer text-[#2A4D7A] hover:text-[#6f92c7] transition-transform duration-200" />
      </div>
    </header>
  );
};

export default Header;
