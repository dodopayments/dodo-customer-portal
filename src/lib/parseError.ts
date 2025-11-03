/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";

const parseError = (error: any, customMessage?: string) => {
  console.log("error console", error.response.data);

  if (
    error.response.data !== undefined ||
    error.response.data !== null ||
    error.response.data !== ""
  ) {
    return toast.error(
      error.response.data || customMessage || "Something went wrong",
    );
  }
  return toast.error(customMessage || "Something went wrong");
};

export default parseError;
