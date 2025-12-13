'use client';
import { ThemeProvider } from "./components/MaterialTailwind"
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { WagmiProvider } from 'wagmi';
import '@rainbow-me/rainbowkit/styles.css';

import CustomRainbowKitProvider from './components/CustomRainbowKitProvider';
import { wagmiConfig } from "./config";
import { useState, useEffect } from "react";
import { enableErrorSuppression, disableErrorSuppression } from "./utils/errorSuppression";


export default function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          // Don't retry WebSocket connection errors
          if (error?.message?.includes('WebSocket')) {
            return false;
          }
          return failureCount < 3;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  }));
  


  // Enable comprehensive error suppression
  useEffect(() => {
    enableErrorSuppression();
    
    return () => {
      disableErrorSuppression();
    };
  }, []);

  return (
    <ThemeProvider>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <CustomRainbowKitProvider>
            {children}
          </CustomRainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}

