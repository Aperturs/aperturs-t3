"use client";

import React from "react";
import { useClerk } from "@clerk/nextjs";

import { Button } from "@aperturs/ui/button";

export default function SignOutButton() {
  const { signOut } = useClerk();
  return (
    <Button size="sm" onClick={() => signOut()}>
      Sign Out
    </Button>
  );
}
