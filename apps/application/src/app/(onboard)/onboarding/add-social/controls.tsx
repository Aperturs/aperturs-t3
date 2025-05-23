import Link from "next/link";

import { Button } from "@aperturs/ui/button";

// import { completeOnboarding } from "../../_action";

export default function Controls() {
  return (
    <div className="my-3 flex justify-between gap-2">
      <Button asChild className="w-full">
        <Link href="/onboarding">Back</Link>
      </Button>
      <Button asChild className="w-full">
        <Link href="/onboarding/pick-plan">Next</Link>
      </Button>
    </div>
  );
}
