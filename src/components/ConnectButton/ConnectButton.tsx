"use client";

import { useConnect } from "wagmi";

export default function ConnectButton() {
  const { connectors, connect } = useConnect();
  return (
    <div className="flex justify-end">
      <button
        className="w-fit rounded mt-4 border p-2 shadow-sm"
        key={connectors[0].uid}
        onClick={() => connect({ connector: connectors[0] })}
      >
        Connect
      </button>
    </div>
  );
}
