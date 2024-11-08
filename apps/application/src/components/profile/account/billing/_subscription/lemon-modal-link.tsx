"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

import { Button } from "@aperturs/ui/button";
import { DropdownMenuItem } from "@aperturs/ui/dropdown-menu";

export function LemonSqueezyModalLink({
  href,
  children,
}: {
  href?: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (typeof window.createLemonSqueezy === "function") {
      window.createLemonSqueezy();
    }
  }, []);
  return (
    <DropdownMenuItem
      onClick={() => {
        if (href) {
          window.LemonSqueezy.Url.Open(href);
        } else {
          throw new Error(
            "href provided for the Lemon Squeezy modal is not valid.",
          );
        }
      }}
    >
      {children}
    </DropdownMenuItem>
  );
}

export function LemonSqueezyModaButton({
  href,
  children,
}: {
  href?: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (typeof window.createLemonSqueezy === "function") {
      window.createLemonSqueezy();
    }
  }, []);
  return (
    <Button
      variant="secondary"
      onClick={() => {
        if (href) {
          window.LemonSqueezy.Url.Open(href);
        } else {
          throw new Error(
            "href provided for the Lemon Squeezy modal is not valid.",
          );
        }
      }}
    >
      {children}
    </Button>
  );
}
