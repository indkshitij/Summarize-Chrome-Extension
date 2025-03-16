import React from "react";
import { GiArtificialHive } from "react-icons/gi";

const LogoSection = () => {
  return (
    <div className="flex justify-between items-center mb-4 ">
      <div className="flex items-center gap-1 text-base text-emerald-900">
        <div className="text-5xl ">
          <GiArtificialHive />
        </div>
        <div className="">
          <h1 className="text-2xl font-semibold"> Smart AI Summarizer</h1>
          <h2 className="text-xs font-normal -mt-1">Summarize web content instantly!</h2>
        </div>
      </div>
    </div>
  );
};

export default LogoSection;
