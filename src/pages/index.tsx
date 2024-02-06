import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    // Only execute this code on the client side
    if (user) {
      router.replace("/dashboard").catch((error) => {
        // Handle error here
        console.error("Error while redirecting:", error);
      });
    } else {
      router.replace("/login").catch((error) => {
        // Handle error here
        console.error("Error while redirecting:", error);
      });
    }
  });
  return null;
}
