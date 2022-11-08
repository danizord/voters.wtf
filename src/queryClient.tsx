import { QueryClient, QueryClientProvider as _QueryClientProvider } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

export const QueryClientProvider = ({ children }) => {
  return <_QueryClientProvider client={queryClient}>{children}</_QueryClientProvider>;
};
