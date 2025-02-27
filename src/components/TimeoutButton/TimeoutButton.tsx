"use client";

import { abi } from "@/contracts/RPSLS";
import { useWriteContract } from "wagmi";

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
  const { writeContract } = useWriteContract();

  const handleClick = () => {
    writeContract(
      {
        abi,
        address: contractAddress,
        functionName,
      },
      {
        onSettled() {
          onSettled();
        },
      }
    );
  };

  return (
    <button className="border py-2 px-4 rounded w-fit" onClick={handleClick}>
      Call timeout
    </button>
  );
}
