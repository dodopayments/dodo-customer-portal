"use client";

import IconColors from "@/components/custom/icon-colors";
import { SmileySad } from "@phosphor-icons/react/dist/ssr";

const Error = () => {
  return (
    <div className="w-full h-screen flex flex-col bg-bg-primary items-center justify-center">
      <IconColors icon={<SmileySad className="w-6 h-6" />} />
      <h1 className="text-xl mt-4 font-display font-semibold">
        Something went wrong
      </h1>
      <p className="text-sm mt-2 max-w-sm text-text-secondary text-center">
        You might be having a network connection problem, the link might be
        expired, or the link/product might be invalid.
      </p>
    </div>
  );
};

export default Error;
