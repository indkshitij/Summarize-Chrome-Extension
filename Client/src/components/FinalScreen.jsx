import React, { useContext, useState, useEffect } from "react";
import { FaCopy, FaDownload, FaLanguage } from "react-icons/fa";
import { MdRecordVoiceOver } from "react-icons/md";
import { IoReloadCircle, IoSpeedometerOutline } from "react-icons/io5";
import { IoPause } from "react-icons/io5";
import { AppContext } from "../Context/AppContext";
import LogoSection from "./LogoSection";
import Summary from "./summary";

const shortFormLanguages = {
    English: "en",
    Hindi: "hi",
    Punjabi: "pa",
    Gujarati: "gu",
    Marathi: "mr",
    Tamil: "ta",
    Telugu: "te",
    Malayalam: "ml",
    Bengali: "bn",
    Urdu: "ur",
    Kannada: "kn",
    Sindhi: "sd",
  };
const FinalScreen = () => {
  const {
    summarizePage,
    copyToClipboard,
    downloadSummary,
    copied,
    downloadText,
    loading,
    summary,
    showSpeedOptions,
    setShowSpeedOptions,
    language,
    setLanguage,
    languages,
  } = useContext(AppContext);

  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [speechRate, setSpeechRate] = useState(1);

  useEffect(() => {
    const getVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();

      
      const filteredVoices = availableVoices.filter((voice) =>
        Object.values(shortFormLanguages).some((code) => voice.lang.startsWith(code))
      );

      setVoices(filteredVoices);
      if (filteredVoices.length > 0) {
        setSelectedVoice(filteredVoices[0]);
      }
    };

    getVoices();
    window.speechSynthesis.onvoiceschanged = getVoices;
  }, []);

  const handleSpeak = () => {
    if (!summary || !selectedVoice) return;

    window.speechSynthesis.cancel();

    const sentences = summary.match(/[^.!?]+[.!?]*/g) || [summary];
    let index = 0;

    const speakNext = () => {
      if (index < sentences.length) {
        const utterance = new SpeechSynthesisUtterance(sentences[index].trim());
        utterance.voice = selectedVoice;
        utterance.rate = parseFloat(speechRate);
        utterance.onend = () => {
          index++;
          setTimeout(speakNext, 50);
        };
        window.speechSynthesis.speak(utterance);
      }
    };

    speakNext();
  };
  const stopSpeak = () => {
    window.speechSynthesis.cancel();
  };

  return (
    <div className="py-5 px-8 w-full mx-auto text-white relative bg-[#f7f7f7]">
      <LogoSection />

      <Summary summary={summary } />

      <div className="mt-2 flex justify-between items-center gap-2">
        {/* Voice Selection Dropdown */}
        <select
          onChange={(e) => {
            const selected = voices.find((v) => v.name === e.target.value);
            if (selected) setSelectedVoice(selected);
          }}
          className="w-full py-2 px-2 bg-teal-900  text-sm  rounded-lg shadow-md cursor-pointer focus:outline-none"
        >
          {voices.map((voice, index) => (
            <option key={index} value={voice.name}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>

        {/* Speed Selection Button */}
        <div className="w-32 relative">
          <IoSpeedometerOutline className="absolute top-2 left-2 text-xl " />
          <select
            value={speechRate}
            onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
            className="w-full py-2 pl-7 bg-teal-900  text-sm  rounded-lg shadow-md cursor-pointer focus:outline-none"
          >
            {["0.25", "0.75", "1", "1.25", "1.5", "2"].map((speed, index) => (
              <option key={index} value={speed}>
                {speed}x
              </option>
            ))}
          </select>
        </div>
        {/* Speak Button */}
        <div
          onClick={handleSpeak}
          className="w-fit h-fit p-2 bg-teal-900 rounded-full shadow-md cursor-pointer hover:scale-110 duration-300"
        >
          <MdRecordVoiceOver className="text-xl " />
        </div>
        <div
          onClick={stopSpeak}
          className="w-fit h-fit p-2 bg-teal-900 rounded-full shadow-md cursor-pointer hover:scale-110 duration-300"
        >
          <IoPause className="text-xl " />
        </div>
      </div>

      {/* ✅ Buttons Section */}
      <div className="mt-6">
        <div className="grid grid-cols-3 gap-2 w-full text-base">
          <button
            onClick={() => summarizePage(language)}
            className="min-w-full p-2.5 bg-teal-900 text-white text-sm flex justify-center items-center gap-2 rounded-lg transition-all duration-300 cursor-pointer 
             hover:bg-teal-800 hover:shadow-md 
             active:scale-95"
          >
            <IoReloadCircle className="text-lg" />{" "}
            {loading ? "Summarising" : "Summarize"}
          </button>
          <button
            onClick={copyToClipboard}
            className="min-w-full p-2.5 bg-teal-900 text-white text-sm flex justify-center items-center gap-2 rounded-lg transition-all duration-300 cursor-pointer 
             hover:bg-teal-800 hover:shadow-md 
             active:scale-95"
          >
            <FaCopy /> {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={downloadSummary}
            className="min-w-full p-2.5 bg-teal-900 text-white text-sm flex justify-center items-center gap-2 rounded-lg transition-all duration-300 cursor-pointer 
             hover:bg-teal-800 hover:shadow-md 
             active:scale-95"
          >
            <FaDownload /> {downloadText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinalScreen;
