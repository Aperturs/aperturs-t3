import React from "react";

import LinkedInPreview from "../previews/linkedin";

interface LinkedInPreviewProps {
  posts: string[];
}

export default function GeneratedPosts({ posts }: LinkedInPreviewProps) {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, i) => (
        <LinkedInPreview key={i} content={post} />
      ))}
    </div>
  );
}
