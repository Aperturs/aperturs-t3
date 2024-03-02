"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    } else {
      router.replace("/sign-in");
    }
  });
  return null;
}
