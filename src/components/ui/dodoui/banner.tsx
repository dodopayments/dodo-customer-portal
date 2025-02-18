import Link from "next/link";
import React from "react";
const Banner = () => {
  const mode = "live";

  if (mode == "live") return null;
  return (
    <div className="w-[100vw] max-w-[1920px] hidden absolute z-20 top-0 lg:flex flex-col items-center">
      <div className="h-1 w-[100vw] shadow-md bg-[#22272F] dark:bg-bg-secondary "></div>
      <div className="rounded-b-md shadow-md font-medium text-sm font-body h-fit w-fit bg-[#22272F] dark:bg-bg-secondary  text-white px-3 py-2 pt-1">
        You are in Test Mode.
        <Link
          href="https://docs.dodopayments.com/miscellaneous/test-mode-vs-live-mode"
          target="_blank"
          className=" ml-2 underline"
        >
          Learn More
        </Link>
      </div>
    </div>
  );
};

export default Banner;
