"use client";

import { abi } from "@/contracts/RPSLS";
import Link from "next/link";
import { useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import TimeoutButton from "../TimeoutButton";
import MoveInput from "../MoveInput";
import { useResponseValues } from "@/hooks/useResponseValues";

type Props = {
  contractAddress: `0x${string}`;
  address: `0x${string}`;
};

export default function EndGameForm({ contractAddress, address }: Props) {
  const [salt] = useState(() => localStorage.getItem(address));
  const [error, setError] = useState(false);
  const { isLoading, isError, stake, move2, lastDate, isTimeout, refetch } =
    useResponseValues(contractAddress);
  const { status: contractStatus, writeContract } = useWriteContract();
  const [hash, setHash] = useState<`0x${string}` | undefined>();
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
    contractStatus === "pending" ||
    (txStatus === "pending" && contractStatus !== "idle") ||
    txFetchStatus === "fetching";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const move = formData.get("move") as string;
    const salt = formData.get("salt") as string;
    if (move && salt) {
      setError(false);
      writeContract(
        {
          abi,
          address: contractAddress,
          functionName: "solve",
          args: [Number(move), BigInt(salt)],
        },
        {
          onSuccess(data) {
            setHash(data);
            localStorage.removeItem(address);
          },
          onError(error) {
            console.error("error:", error);
            setError(true);
          },
        }
      );
    }
  };

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (txReceipt || stake === BigInt(0)) {
    return (
      <div className="flex flex-col border gap-2 p-8">
        <h2>Game over</h2>
        <Link href="/" className="underline">
          New game
        </Link>
      </div>
    );
  }

  if (!move2) {
    return (
      <div className="flex flex-col border gap-2 p-8">
        <h1>Hello Player 1</h1>
        <p>Player 2 has not made its move</p>
        <span>{`Last move: ${lastDate}`}</span>
        {isTimeout && (
          <TimeoutButton
            onSettled={() => refetch()}
            contractAddress={contractAddress}
            functionName="player2Timeout"
          />
        )}
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-2 border p-8" onSubmit={handleSubmit}>
      <span>{`Last move: ${lastDate}`}</span>
      <MoveInput />
      <label className={`flex gap-2${!!salt ? " hidden" : ""}`}>
        Salt:
        <input
          name="salt"
          className="text-black"
          required
          defaultValue={salt ?? undefined}
        />
      </label>
      <button
        className="w-fit rounded mt-4 border p-2 shadow-sm"
        type="submit"
        disabled={isPending}
      >
        {!isPending ? "Finish game" : "Finishing game..."}
      </button>
      {(error || isError) && (
        <span className="text-red-600">There was an error</span>
      )}
    </form>
  );
}
