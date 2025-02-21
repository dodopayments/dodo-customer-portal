"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/hooks/redux-hooks";
import { setTokenData } from "@/redux/slice/token/tokenSlice";
import { tokenHelper } from "@/lib/token-helper";
import LoadingOverlay from "@/components/loading-overlay";

const Page = () => {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.token) {
      try {
        const tokenData = tokenHelper.store(params.token as string);
        if (tokenData) {
          dispatch(setTokenData(tokenData));
          router.push("/session/billing-history");
        } else {
          router.push("/expired");
        }
      } catch (error) {
        console.error('Token storage failed:', error);
        router.push("/expired");
      } finally {
        setIsLoading(false);
      }
    }
  }, [params.token, router, dispatch]);

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return null;
};

export default Page;
