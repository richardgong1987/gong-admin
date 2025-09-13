"use client";
import "@/css/satoshi.css";
import "@/css/style.css";

import type { PropsWithChildren } from "react";
import { Providers } from "./providers";
import { MenuStore } from "@/store/menu-store";
import {Sidebar} from "lucide-react";

export default function RootLayout({ children }: PropsWithChildren) {
  MenuStore.getState().getMenu();
  return (
      <Providers>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
            {/*<Header />*/}
            <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
              {children}
            </main>
          </div>
        </div>
      </Providers>
  );
}
