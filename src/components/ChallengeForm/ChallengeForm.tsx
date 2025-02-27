"use client";

import { abi, bytecode } from "@/contracts/RPSLS";
import { getSalt } from "@/utils/utils";
import Link from "next/link";
import { useState } from "react";
import { encodePacked, keccak256, parseEther } from "viem";
import { useDeployContract, useWaitForTransactionReceipt } from "wagmi";
import MoveInput from "../MoveInput";

type Props = {
  address: `0x${string}` | undefined;
};

export default function ChallengeForm({ address }: Props) {
  const [error, setError] = useState(false);
  const [salt, setSalt] = useState<bigint | undefined>();
  const [challenged, setChallenged] = useState("");
  const { status: contractStatus, deployContract } = useDeployContract();
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
    (txStatus === "pending" && contractStatus === "success") ||
    txFetchStatus === "fetching";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(false);
    const formData = new FormData(e.target as HTMLFormElement);
    const opponent = formData.get("opponent") as `0x${string}`;
    const value = formData.get("value") as string;
    const move = formData.get("move") as string;
    if (address && value && move && opponent) {
      const addressSalt = getSalt(address);
      const commitment = keccak256(
        encodePacked(["uint8", "uint256"], [Number(move), addressSalt])
      );
      deployContract(
        {
          abi,
          args: [opponent, commitment],
          account: address,
          bytecode,
          value: parseEther(value),
        },
        {
          onSuccess(data) {
            setHash(data);
            setChallenged(opponent);
            setSalt(addressSalt);
          },
          onError(error) {
            console.error("error:", error);
            setError(true);
          },
        }
      );
    }
  };

  if (txReceipt) {
    return (
      <div className="flex flex-col border gap-2 p-8">
        <h2>{`You just challenged ${challenged}`}</h2>
        <p>
          When Player 2 makes their move you will have to confirm yours, so
          remember what you input.
        </p>
        <p>
          If you play the next step on this device you won&apos;t need it, but
          if you don&apos;t, you also need to remember this number called salt:{" "}
          <span className="font-extrabold">{salt}</span>. If the value
          doesn&apos;t match when you end the game you will lose.
        </p>
        <p>
          Send your opponent this link for them to make their move:{" "}
          <Link
            href={`${window.location.origin}?contract=${txReceipt.contractAddress}`}
            className="whitespace-nowrap underline"
          >{`${window.location.origin}?contract=${txReceipt.contractAddress}`}</Link>
        </p>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-2 border p-2 sm:p-8"
      onSubmit={handleSubmit}
    >
      <p className="font-bold mb-8">
        To start the game you need to challenge someone by filling out this
        form.
      </p>
      <label className="flex gap-2 justify-between w-full flex-wrap">
        Address:{" "}
        <input
          name="opponent"
          placeholder="0xA0Cf…251e"
          required
          className="text-black border min-w-[380px]"
        />
      </label>
      <label className="flex justify-between w-full">
        Stake (in ETH):
        <input
          name="value"
          placeholder="0.05"
          required
          className="text-black border"
        />
      </label>
      <MoveInput />
      <button
        className="w-fit rounded mt-4 border p-2 shadow-sm"
        type="submit"
        disabled={isPending}
      >
        {!isPending ? "Deploy" : "Deploying..."}
      </button>
      {error && <span className="text-red-600">There was an error</span>}
    </form>
  );
}
