"use client";

import Link from "next/link";
import { useState } from "react";
import { useWaitForTransactionReceipt } from "wagmi";
import OpponentForm from "./OpponentForm";
import TimeoutButton from "../TimeoutButton";
import { useResponseValues } from "@/hooks/useResponseValues";

type Props = {
  contractAddress: `0x${string}`;
};

export default function OpponentSection({ contractAddress }: Props) {
  const [hash, setHash] = useState<`0x${string}` | undefined>();
  const {
    data,
    status: txStatus,
    fetchStatus: txFetchStatus,
  } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: !!hash,
    },
  });
  const { isLoading, isError, stake, move2, lastDate, isTimeout, refetch } =
    useResponseValues(contractAddress);

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (stake === BigInt(0)) {
    return (
      <div className="flex flex-col border gap-2 p-8">
        <h2>Game over</h2>
        <Link href="/" className="underline">
          New game
        </Link>
      </div>
    );
  }

  if (data || !!move2) {
    return (
      <div className="flex flex-col border gap-2 p-8">
        <h2>{`You made your move.`}</h2>
        <p>
          Is time for player 1 to finish the game. Send them this link :{" "}
          <Link
            href={`${window.location.origin}?contract=${contractAddress}`}
            className="whitespace-nowrap underline"
          >{`${window.location.origin}?contract=${contractAddress}`}</Link>
        </p>
        <span>{`Last move: ${lastDate}`}</span>
        {isTimeout && (
          <TimeoutButton
            contractAddress={contractAddress}
            functionName="player1Timeout"
            onSettled={() => refetch()}
          />
        )}
      </div>
    );
  }
  return (
    <>
      <OpponentForm
        contractAddress={contractAddress}
        setHash={setHash}
        value={stake}
        txFetchStatus={txFetchStatus}
        txStatus={txStatus}
      />
      {isError && <span className="text-red-600">There was an error</span>}
    </>
  );
}
