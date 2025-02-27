"use client";

import { abi } from "@/contracts/RPSLS";
import { useEffect, useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

type Props = {
  contractAddress: `0x${string}`;
  functionName: "player1Timeout" | "player2Timeout";
  onSettled: () => void;
};

export default function TimeoutButton({
  contractAddress,
  functionName,
  onSettled,
}: Props) {
  const [error, setError] = useState(false);
  const [hash, setHash] = useState<`0x${string}` | undefined>();
  const { status, writeContract } = useWriteContract();
  const {
    data: txReceipt,
    status: txStatus,
    fetchStatus: txFetchStatus,
  } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: !!hash,
    },
  });
  const isPending =
    status === "pending" ||
    (txStatus === "pending" && status !== "idle") ||
    txFetchStatus === "fetching";

  const handleClick = () => {
    writeContract(
      {
        abi,
        address: contractAddress,
        functionName,
      },
      {
        onSuccess(data) {
          setHash(data);
        },
        onError(error) {
          console.error("error:", error);
          setError(true);
        },
      }
    );
  };

  useEffect(() => {
    if (!!txReceipt) onSettled();
  }, [onSettled, txReceipt]);

  return (
    <>
      <button
        className="border py-2 px-4 rounded w-fit"
        onClick={handleClick}
        disabled={isPending}
      >
        {!isPending ? "Call timeout" : "Calling timeout..."}
      </button>
      {error && <span className="text-red-600">There was an error</span>}
    </>
  );
}
