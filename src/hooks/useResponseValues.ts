import { abi } from "@/contracts/RPSLS";
import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";

export function useResponseValues(contractAddress: `0x${string}`) {
  const [isTimeout, setIsTimeout] = useState(false);
  const {
    data: stake,
    isLoading: isLoadingStake,
    isError: isErrorStake,
    refetch,
  } = useReadContract({
    abi,
    address: contractAddress,
    functionName: "stake",
  });
  const {
    data: move2,
    isLoading: isLoadingMove2,
    isError: isErrorMove2,
  } = useReadContract({
    abi,
    address: contractAddress,
    functionName: "move2",
  });
  const {
    data: timeout,
    isLoading: isLoadingTimeout,
    isError: isErrorTimeout,
  } = useReadContract({
    abi,
    address: contractAddress,
    functionName: "timeout",
  });
  const {
    data: lastActionTime,
    isLoading: isLoadingLastActionTime,
    isError: isErrorLastActionTime,
  } = useReadContract({
    abi,
    address: contractAddress,
    functionName: "lastActionTime",
  });
  const lastDate = new Date(Number(lastActionTime) * 1000).toLocaleDateString(
    "en-GB",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  useEffect(() => {
    if (lastActionTime && timeout)
      setIsTimeout(
        Date.now() - Number(lastActionTime) * 1000 > 1000 * Number(timeout)
      );
  }, [lastActionTime, timeout]);

  const isLoading =
    isLoadingStake ||
    isLoadingLastActionTime ||
    isLoadingMove2 ||
    isLoadingTimeout;
  const isError =
    isErrorStake || isErrorLastActionTime || isErrorMove2 || isErrorTimeout;

  return {
    isLoading,
    isError,
    stake,
    move2,
    lastDate,
    isTimeout,
    refetch,
  };
}
