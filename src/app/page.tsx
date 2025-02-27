"use client";

import MainScreen from "@/components/MainScreen";
import Providers from "@/components/Providers";
import { Suspense } from "react";

export default function Home() {
  return (
    <Providers>
      <div className="w-full flex justify-center items-center min-h-screen">
        <div className="max-w-screen-lg flex flex-col">
          <Suspense fallback={<span>Loading...</span>}>
            <MainScreen />
          </Suspense>
        </div>
      </div>
    </Providers>
  );
}
