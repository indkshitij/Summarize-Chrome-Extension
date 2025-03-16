import React, { useContext, useState } from "react";
import { FaCopy, FaDownload } from "react-icons/fa";
import { MdRecordVoiceOver, MdVoiceOverOff } from "react-icons/md";
import { IoSpeedometerOutline } from "react-icons/io5";
import { AppContext } from "../Context/AppContext";
import Loading from "./Loading";
import { MdSummarize } from "react-icons/md";
import LogoSection from "./LogoSection";
import Summary from "./summary";

const InitialScreen = () => {
  const {
    summarizePage,
    copyToClipboard,
    downloadSummary,
    copied,
    setCopied,
    downloadText,
    setDownloadText,
    loading,
    setLoading,
    summary,
    setSummary,
    showSpeedOptions,
    setShowSpeedOptions,
    language,
    setLanguage,
    languages,
    wordCount,
    setWordCount,
  } = useContext(AppContext);

  const options = [];
  for (let i = 50; i <= 700; i += 50) {
    options.push(
      <option className="active:bg-lime-200" key={i} value={i}>
        {i}
      </option>
    );
  }
  return (
    <div className="py-5 px-8 w-full max-h-140 mx-auto text-white relative bg-[#f7f7f7]">
      {/* ✅ Logo Section */}
      <LogoSection />

      {/* ✅ Summary Box */}
      <Summary summary={summary} />

      <div className="mt-2 w-full grid grid-cols-2 gap-2">
        <div className="">
          <p className="text-xs text-teal-950 font-medium ">Word Count</p>
          <select
            className="w-full py-2 px-2 bg-teal-900  text-sm  rounded-lg shadow-md cursor-pointer focus:outline-none"
            value={wordCount}
            onChange={(e) => setWordCount(e.target.value)}
          >
            {options}
          </select>
        </div>
        <div className="">
          <p className="text-xs text-teal-950 font-medium ">Select Language</p>
          <select
            className="w-full py-2 px-2 bg-teal-900  text-sm  rounded-lg shadow-md cursor-pointer focus:outline-none"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {Object.keys(languages).map((lang, index) => (
              <option className="active:bg-lime-200" key={index} value={languages[lang]}>
                {lang}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ✅ Buttons Section */}
      <div className="mt-4 flex justify-end items-center">
        <button
          onClick={() => summarizePage(language, wordCount)}
          className="min-w-full p-2.5 bg-teal-900 text-white text-sm flex justify-center items-center gap-2 rounded-lg transition-all duration-300 cursor-pointer 
             hover:bg-teal-800 hover:shadow-md 
             active:scale-95"
        >
          <MdSummarize className="text-lg" />
          {loading ? "Summarizing..." : "Summarize"}
        </button>
      </div>
    </div>
  );
};

export default InitialScreen;
