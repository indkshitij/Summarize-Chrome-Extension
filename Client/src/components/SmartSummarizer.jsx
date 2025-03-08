import React, { useState } from "react";
import { FaCopy, FaDownload } from "react-icons/fa";
import { LuLoader } from "react-icons/lu";

const SmartSummarizer = () => {
  const [copied, setCopied] = useState(false);
  const [downloadText, setDownloadText] = useState("Download");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");

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
    setDownloadText("Downloaded!");
    setTimeout(() => setDownloadText("Download"), 2000);
  };

  const summarizePage = async () => {
    setLoading(true);
    setSummary("");

    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const url = tab.url;

      const apiResponse = await fetch("http://127.0.0.1:8000/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await apiResponse.json();

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

  return (
    <>
      {loading ? (
        <div className="bg-[#161e29] w-[400px] p-5 flex items-center justify-start gap-2">
          <div className=" text-[#263ce7] animate-spin text-5xl">
            <LuLoader />
          </div>
          <p className="text-white text-md">
            Analyzing and generating the summary
          </p>
        </div>
      ) : (
        <>
          <div className="py-5 px-8 w-[500px] max-h-140 mx-auto bg-[#161e29] text-white relative">
            <div className="flex justify-between items-center mb-4 ">
              <h1 className="text-2xl font-medium">Smart AI Summarizer</h1>
            </div>

            {/* ✅ Display summary */}
            {summary ? (
              <div className="p-3 border border-gray-500 rounded-lg shadow-md overflow-auto max-h-96">
                <p className="text-sm text-justify leading-relaxed whitespace-pre-line">
                  {summary}
                </p>
              </div>
            ) : (
              <p className="text-xs pr-5">
                Click the button below to instantly generate a concise summary.
              </p>
            )}

            {/* ✅ Buttons Section */}
            <div className="mt-4">
              {summary ? (
                <div className="grid grid-cols-2 gap-5 w-full text-base">
                  {/* Copy Button */}
                  <button
                    onClick={copyToClipboard}
                    className="w-full flex items-center justify-center gap-2 text-sm bg-[#263ce7] text-white min-w-28 px-2 py-2 rounded-sm hover:scale-105 active:scale-90 cursor-pointer duration-300 transition"
                  >
                    <FaCopy /> {copied ? "Copied!" : "Copy"}
                  </button>

                  {/* Download Button */}
                  <button
                    onClick={downloadSummary}
                    className="w-full flex items-center justify-center gap-2 text-sm bg-[#263ce7] text-white min-w-28 px-2 py-2 rounded-sm hover:scale-105 active:scale-90 cursor-pointer duration-300 transition"
                  >
                    <FaDownload /> {downloadText}
                  </button>
                </div>
              ) : (
                // Summarize Button
                <div className="flex justify-between items-center">
                  <button
                    onClick={summarizePage}
                    className="w-full  text-center bg-[#263ce7] text-white p-3 text-sm rounded-lg hover:scale-105 active:scale-90 duration-300 transition cursor-pointer"
                  >
                    {loading
                      ? "sabr krrle lodu lalit ready krr rha hu"
                      : "Summarize"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SmartSummarizer;
