"use client";

import { abi } from "@/contracts/RPSLS";
import { Dispatch, SetStateAction, useState } from "react";
import { useWriteContract } from "wagmi";
import MoveInput from "../MoveInput";

type Props = {
  contractAddress: `0x${string}`;
  value?: bigint;
  setHash: Dispatch<SetStateAction<`0x${string}` | undefined>>;
};

export default function OpponentForm({
  contractAddress,
  value,
  setHash,
}: Props) {
  const [error, setError] = useState(false);
  const { writeContract } = useWriteContract();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const move = formData.get("move") as string;
    if (move) {
      setError(false);
      writeContract(
        {
          abi,
          address: contractAddress,
          functionName: "play",
          args: [Number(move)],
          value,
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
    }
  };

  return (
    <form className="flex flex-col gap-2 border p-8" onSubmit={handleSubmit}>
      <h1>Hello Player 2, make your move</h1>
      <MoveInput />
      <button className="w-fit rounded mt-4 border p-2 shadow-sm" type="submit">
        Play
      </button>
      {error && <span className="text-red-600">There was an error</span>}
    </form>
  );
}
