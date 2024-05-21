import React from "react";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { MdOutlineCollections } from "react-icons/md";

const Bottom: React.FC = () => {
  return (
    <div className="w-full bg-gray-100 fixed bottom-0 left-0 right-0 h-16 py-5 flex items-center justify-center">
      <div className="grid grid-cols-2 gap-20">
        <Link href={"/"} passHref>
          <div className="flex items-center justify-center flex-col text-[#ff4081]">
            <FaHome size={25} />
            <div className="text-sm font-bold">Home</div>
          </div>
        </Link>
        <Link href={"/nfts"} passHref>
          <div className="flex items-center justify-center flex-col text-[#ff4081]">
            <MdOutlineCollections size={25} />
            <div className="text-sm font-bold uppercase">My NFTs</div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Bottom;
