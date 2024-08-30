import type { PreferenceType } from "@aperturs/validators/personalization";
import { Button } from "@aperturs/ui/button";
import { Label } from "@aperturs/ui/label";
import { RadioGroup, RadioGroupItem } from "@aperturs/ui/radio-group";
import { preferenceOptions } from "@aperturs/validators/personalization";

import { useDetailsContext } from "./details-provider";

export default function StepThree() {
  const { setPreferences, preferences } = useDetailsContext();

  const handlePreferenceChange = (key: string, value: PreferenceType) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
    console.log(preferences, "pref");
  };

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Select your preferences</h2>
      {preferenceOptions.map((pref) => (
        <div key={pref.key} className="py-3">
          <h3 className="text-lg  font-semibold">{pref.title}</h3>
          <p className="my-0  text-sm text-muted-foreground">
            {pref.description}
          </p>
          <RadioGroup
            onValueChange={(value: PreferenceType) =>
              handlePreferenceChange(pref.key, value)
            }
            defaultValue={preferences[pref.key] ?? pref.options[0]}
            className="mt-3 flex w-full flex-col space-y-2 sm:flex-row sm:space-y-0"
          >
            {pref.options.map((option) => (
              <Button
                asChild
                variant="muted"
                key={option}
                className="flex w-full items-center space-x-2"
              >
                <div className="w-full place-content-start">
                  <RadioGroupItem value={option} id={`${pref.key}-${option}`} />
                  <Label
                    htmlFor={`${pref.key}-${option}`}
                    className="cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
              </Button>
            ))}
          </RadioGroup>
        </div>
      ))}
    </div>
  );
}
