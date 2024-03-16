import { useState } from "react";

import { Dropzone } from "~/components/custom/dropzone";

export default function Youtube() {
  const [files, setFiles] = useState<string[]>([]);
  return (
    <div>
      <Dropzone onChange={setFiles} fileExtension="video/*" />
    </div>
  );
}
