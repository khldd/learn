import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 401 errors
        if (error?.response?.status === 401) {
          return false
        }
        return failureCount < 3
      },
    },
  },
})
