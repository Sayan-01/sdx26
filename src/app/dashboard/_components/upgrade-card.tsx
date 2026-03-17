import React from "react";

const UpgradeCard = ({ credits }: { credits: number }) => {
  if (credits > 1) return (
    <div className="border rounded-xl mb-4 dark:border-zinc-800 relative z-20">
      <div className="p-2 pb-0  bg-gradient-to-br from-[#393f4f] via-[#FFD3E9] to-[#FFEED7] dark:bg-[linear-gradient(60deg,_rgb(247,_149,_51),_rgb(243,_112,_85),_rgb(239,_78,_123),_rgb(161,_102,_171),_rgb(80,_115,_184),_rgb(16,_152,_173),_rgb(7,_179,_155),_rgb(111,_186,_130))] rounded-t-xl text-sm">
        <div className="bg-[#F1F2F6] dark:bg-zinc-800 p-3 h-full rounded-t-[10px]">
          <div className="text-xs font-semibold flex justify-right dark:text-zinc-200">
            {/* TODO: Add Plan Name using webhook */}
            {/* <p>Basic Plane</p>
            <span className="bg-[#D1D6F2] dark:bg-zinc-700  px-3 py-0.5 text-[#4964f9] dark:text-blue-400 rounded-full">4/10</span> */}
            <p>{credits}</p>/<p>1000 credits</p>
          </div>
          <div className="h-1.5 bg-[#D1D6F2] dark:bg-zinc-700 rounded-full mt-2" />
          <div className="h-1.5 bg-[#bfc8fb] dark:bg-zinc-600 rounded-full w-[80%] mt-2" />
          <div className="h-1.5 bg-[#c3cbfc] dark:bg-zinc-500 rounded-full w-[90%] mt-2" />
        </div>
      </div>
      <div className="p-3">
        <p className="text-xs font-semibold mb-2 dark:text-zinc-200">
          🚀 Your Plane is Active
        </p>
        <p className="text-xs opacity-60 dark:text-zinc-400">Now use all the features include AI and more</p>
      </div>
    </div>
  );
  else
    return (
      <div className="border rounded-xl mb-4 dark:border-zinc-800">
        <div className="p-3 pb-0 h-24 bg-gradient-to-br from-[#D6E1FF] via-[#FFD3E9] to-[#FFEED7] dark:bg-[linear-gradient(60deg,_rgb(247,_149,_51),_rgb(243,_112,_85),_rgb(239,_78,_123),_rgb(161,_102,_171),_rgb(80,_115,_184),_rgb(16,_152,_173),_rgb(7,_179,_155),_rgb(111,_186,_130))] rounded-t-xl text-sm">
          <div className="bg-[#F1F2F6] dark:bg-zinc-800 p-3 h-full rounded-t-[10px]">
            <div className="text-xs font-semibold flex justify-between dark:text-zinc-200">
              <p>Basic Plane</p>
              <span className="bg-[#D1D6F2] dark:bg-zinc-700  px-3 py-0.5 text-[#4964f9] dark:text-blue-400 rounded-full">4/10</span>
            </div>
            <div className="h-1.5 bg-[#D1D6F2] dark:bg-zinc-700 rounded-full mt-2" />
            <div className="h-1.5 bg-[#bfc8fb] dark:bg-zinc-600 rounded-full w-[80%] mt-2" />
            <div className="h-1.5 bg-[#c3cbfc] dark:bg-zinc-500 rounded-full w-[90%] mt-2" />
          </div>
        </div>
        <div className="p-3">
          <p className="text-xs font-semibold mb-2 dark:text-zinc-200">🚀 Upgrade to Smart AI</p>
          <p className="text-xs opacity-60 dark:text-zinc-400">Unlock all the features include AI and more</p>
        </div>
      </div>
    );
};

export default UpgradeCard;
