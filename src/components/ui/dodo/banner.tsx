import { Mode } from "@/lib/http";
import Link from "next/link";

export const Banner = () => {
  if (Mode == "live") return null;

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

export const MobileBanner = () => {
  if (Mode == "live") return null;

  return (
    <div className="w-[100vw] lg:hidden  max-w-[1920px] z-20 flex flex-col items-center">
      <div className=" shadow-md font-medium text-xs font-body  h-full w-full flex justify-center items-center bg-[#22272F] dark:bg-bg-secondary  text-white px-3 py-2">
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
