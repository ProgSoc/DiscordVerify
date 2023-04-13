import { useQuery } from "@tanstack/react-query";

interface AuthStatus {
  loggedIn: boolean;
}

export default function useAuthStatus() {
  return useQuery<AuthStatus, Error>({
    queryKey: ["authStatus"],
    queryFn: async ({ signal }) => {
      const response = await fetch("/api/auth/status", {
        credentials: "include",
        signal,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch auth status");
      }
      const data = (await response.json()) as AuthStatus;
      return {
        loggedIn: data.loggedIn,
      };
    },
  });
}
