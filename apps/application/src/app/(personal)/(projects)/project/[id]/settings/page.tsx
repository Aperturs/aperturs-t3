import React from "react";

import Settings from "./settingsComp";

export default function SettingsPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <Settings params={params} />
    </div>
  );
}
