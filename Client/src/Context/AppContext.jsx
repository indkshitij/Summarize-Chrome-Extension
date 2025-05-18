import { createContext, useState } from "react";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [copied, setCopied] = useState(false);
  const [downloadText, setDownloadText] = useState("Download");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");

  const [showSpeedOptions, setShowSpeedOptions] = useState(false);
  const [wordCount, setWordCount] = useState("150");
  const [language, setLanguage] = useState("English");

  
   const languages = {
    English: "English",
    Hindi: "Hindi",
    Punjabi: "Punjabi",
    Gujarati: "Gujarati",
    Marathi: "Marathi",
    Tamil: "Tamil",
    Telugu: "Telugu",
    Malayalam: "Malayalam",
    Bengali: "Bengali",
    Urdu: "Urdu",
    Kannada: "Kannada",
  };
  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSummary = () => {
    const element = document.createElement("a");
    const file = new Blob([summary], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "summary.txt";
    document.body.appendChild(element);
    element.click();
    setDownloadText("Downloading!!");
    setTimeout(() => setDownloadText("Download"), 2000);
  };

  const summarizePage = async (language, wordCount) => {
    setLoading(true);
    setSummary("");

    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab || !tab.url) {
        setSummary("Invalid tab or URL not found.");
        setLoading(false);
        return;
      }

      const url = tab.url;
      console.log("Sending API request with:", { url, language, wordCount });


      const apiResponse = await axios.post(
        "http://127.0.0.1:8000/scrape",
        { url, language, wordCount },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      //   const data = await apiResponse.data;
      const data = apiResponse.data;

      if (data.message) {
        let cleanSummary = data.summary.replace(/\*\*/g, "");
        setSummary(cleanSummary);
      } else {
        setSummary("Failed to summarize the page!");
      }
    } catch (error) {
      setSummary("Error fetching the summary: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
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
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
