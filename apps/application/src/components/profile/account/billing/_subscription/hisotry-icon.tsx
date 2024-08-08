import Link from "next/link";

import { Receipt } from "@aperturs/ui/icons";
import ToolTipSimple from "@aperturs/ui/tooltip-final";

export default function HistoryIcon() {
  return (
    <Link href="/billing/history">
      <ToolTipSimple content="Transaction History">
        <Receipt />
      </ToolTipSimple>
    </Link>
  );
}
