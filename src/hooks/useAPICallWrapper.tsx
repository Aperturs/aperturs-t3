import { useMemo, useState } from "react";

export const useAPICallWrapper = () => {
  const [isAPICallLoading, setIsAPICallLoading] = useState(false);
  const [APICallError, setAPICallError] = useState("");
  const [isAPICallSuccess, setIsAPICallSuccess] = useState(false);
  const isAPICallFailure = useMemo(() => APICallError !== "", [APICallError]);
  const wrapAPICall = async <T,>(
    apiCall: () => Promise<T>
  ): Promise<T | undefined> => {
    setAPICallError("");
    setIsAPICallSuccess(false);
    setIsAPICallLoading(true);
    let value;
    try {
      value = await apiCall();
      setIsAPICallSuccess(true);
      return value;
    } catch (error) {
      if (error instanceof Error) {
        setAPICallError(error.message);
      } else {
        setAPICallError("Unknown APICallError");
      }
      console.error(APICallError);
      throw error;
    } finally {
      setIsAPICallLoading(false);
      return value;
    }
  };
  return {
    isAPICallLoading,
    APICallError,
    isAPICallSuccess,
    isAPICallFailure,
    wrapAPICall,
  };
};
