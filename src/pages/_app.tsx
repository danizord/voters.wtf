import { Center, Spinner } from "@chakra-ui/react";
import { Hydrate } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ConnectKitProvider } from "connectkit";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { client as wagmiClient } from "src/blockchain";

import { QueryClientProvider } from "src/queryClient";
import theme from "src/theme";
import { WagmiConfig } from "wagmi";

// Next.js SSR does not play well with CSS-in-JS.
const ChakraProvider = dynamic(async () => (await import("@chakra-ui/react")).ChakraProvider, { ssr: false });
const Layout = dynamic(async () => (await import("src/components/Layout")).Layout, { ssr: false });

function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider>
        <Hydrate state={pageProps.dehydratedState ?? {}}>
          <WagmiConfig client={wagmiClient}>
            <ConnectKitProvider>
              <Suspense
                fallback={
                  <Center minH={"100vh"}>
                    <Spinner size={"xl"} />
                  </Center>
                }
              >
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </Suspense>
            </ConnectKitProvider>
            <ReactQueryDevtools initialIsOpen={true} />
          </WagmiConfig>
        </Hydrate>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
