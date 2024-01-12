"use client";

import React from "react";
import { api } from "~/trpc/react";

export default function Test() {
  const { data } = api.savepost.getSavedPosts.useQuery();

  return (
    <div>
      {data?.map((post) => (
        <div key={post.id}>
          <h1>{post.defaultContent}</h1>
        </div>
      ))}
    </div>
  );
}
