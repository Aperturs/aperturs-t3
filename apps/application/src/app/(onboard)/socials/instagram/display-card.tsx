import type { FbPageConnectData } from "@aperturs/validators/socials";
import { Avatar, AvatarFallback, AvatarImage } from "@aperturs/ui/avatar";
import { Card } from "@aperturs/ui/card";
import { RadioGroupItem } from "@aperturs/ui/radio-group";

export default function DisplayCard({
  id,
  name,
  picture,
  instagram_business_account,
}: FbPageConnectData) {
  return (
    <Card className="flex gap-3">
      <RadioGroupItem value={instagram_business_account?.id ?? id} id={id} />
      <Avatar>
        <AvatarImage src={picture.data.url} alt={name} />
        <AvatarFallback>{name.slice(0, 1)}</AvatarFallback>
      </Avatar>
      <p>{name}</p>
    </Card>
  );
}
