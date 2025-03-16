import React, { useContext } from "react";
import { GiArtificialHive } from "react-icons/gi";
import { AppContext } from "../Context/AppContext";

const Loading = () => {
  const { loading } = useContext(AppContext);

  return (
    <div className="w-full bg-teal-900 p-6 flex flex-col items-center justify-center gap-4 shadow-md">
      <div className="flex justify-center items-center gap-3 text-emerald-500">
        <div className="w-6 h-0.5 bg-emerald-500 rounded-full"></div>
        <h1 className="text-lg font-semibold">Smart AI Summarizer</h1>
        <div className="w-6 h-0.5 bg-emerald-500 rounded-full"></div>
      </div>

      <div className="text-white text-6xl animate-round-slow ">
        <GiArtificialHive />
      </div>

      <div className="text-center">
        <p className="text-white text-lg font-medium">
          Processing your content...
        </p>
        <p className="text-gray-200 text-xs mt-2">
          This will take around 10 seconds. Sit tight while we generate a clear
          summary for you.
        </p>
      </div>
    </div>
  );
};

export default Loading;
