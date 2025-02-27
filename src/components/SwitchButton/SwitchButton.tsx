"use client";

import { useSwitchChain } from "wagmi";

type Props = {
  chainId: number;
};

export default function SwitchButton({ chainId }: Props) {
  const { switchChain } = useSwitchChain();
  return (
    <div className="flex justify-end">
      <button
        className="w-fit rounded mt-4 border p-2 shadow-sm"
        onClick={() => switchChain({ chainId })}
      >
        Switch chain
      </button>
    </div>
  );
}
