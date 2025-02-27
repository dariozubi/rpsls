"use client";

import { useSearchParams } from "next/navigation";
import ChallengeForm from "../ChallengeForm/ChallengeForm";
import ConnectButton from "../ConnectButton";
import { useAccount, useChainId, useReadContract } from "wagmi";
import { abi } from "@/contracts/RPSLS";
import EndGameForm from "../EndGameForm";
import OpponentSection from "../OpponentSection";
import { reduceAddress } from "@/utils/utils";
import { useEffect, useState } from "react";
import SwitchButton from "../SwitchButton";

export default function MainScreen() {
  const searchParams = useSearchParams();
  const account = useAccount();
  const [contractAddress, setContractAddress] = useState<
    `0x${string}` | undefined
  >();

  const { data: player1, isLoading: player1Loading } = useReadContract({
    abi,
    address: contractAddress,
    functionName: "player1",
  });
  const { data: player2, isLoading: player2Loading } = useReadContract({
    abi,
    address: contractAddress,
    functionName: "player2",
  });
  const chainId = useChainId();

  useEffect(() => {
    const contract = searchParams.get("contract");
    setContractAddress(contract ? (contract as `0x${string}`) : undefined);
  }, [searchParams]);

  if (account.status === "connecting" || account.status === "reconnecting") {
    return <span>Loading...</span>;
  }

  if (!account.address) {
    return (
      <div className="flex p-8 flex-col gap-4">
        <h1 className="text-center font-extrabold text-4xl">Welcome!</h1>
        <p>
          This is a Rock, Scissors, Paper, Lizard, Spock game built for
          Ethereum.
        </p>
        <p>To play you first have to connect your MetaMask wallet.</p>
        <div className="flex justify-center">
          <ConnectButton />
        </div>
      </div>
    );
  }

  if (chainId !== account.chainId) {
    return (
      <div className="flex p-8 flex-col gap-4">
        <h1 className="text-center font-extrabold text-4xl">Welcome!</h1>
        <p>
          This is a Rock, Scissors, Paper, Lizard, Spock game built for
          Ethereum.
        </p>
        <p>This game runs in a different chain. Switch to play</p>
        <div className="flex justify-center">
          <SwitchButton chainId={chainId} />
        </div>
      </div>
    );
  }

  if (!!contractAddress) {
    if (player1Loading || player2Loading) {
      return <span>Loading...</span>;
    }

    if (account.address === player1) {
      return (
        <EndGameForm
          contractAddress={contractAddress}
          address={account.address}
        />
      );
    }

    if (account.address === player2) {
      return <OpponentSection contractAddress={contractAddress} />;
    }
  }

  return (
    <div className="flex p-8 flex-col gap-4">
      <span>{`Hello, ${reduceAddress(account.address)}`}</span>

      <div className="flex justify-center mt-4">
        <ChallengeForm address={account.address} />
      </div>
    </div>
  );
}
