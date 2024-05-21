import React from "react";

interface Props {
  mintedData: number;
}
const MintProgress: React.FC<Props> = ({ mintedData }) => {
  const progressBarWidth = (mintedData / 20) * 100;

  return (
    <div className="w-full flex justify-center">
      <div className="w-[300px] relative h-6 flex flex-col items-center rounded-3xl ring-2 ring-[#ff4081] shadow-md overflow-hidden">
        <div className="w-full rounded-3xl">
          <div
            style={{ width: `${progressBarWidth}%` }}
            className="h-6 bg-gradient-to-r from-[#fccadf] to-[#ff4081] rounded-3xl transition-all duration-500 ease-out"
          />
        </div>
        <span className="absolute mt-1 text-sm font-rubik text-black">
          {mintedData} / 20
        </span>
      </div>
    </div>
  );
};

export default MintProgress;
