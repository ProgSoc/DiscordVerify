import { useMutation } from "@tanstack/react-query";

interface VerifyEmail {
  email: string;
}

export default function useVerifyEmail() {
  return useMutation<void, Error, VerifyEmail>({
    mutationFn: async ({ email }) => {
      const response = await fetch("/api/email/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to verify email");
      }
    },
  });
}
