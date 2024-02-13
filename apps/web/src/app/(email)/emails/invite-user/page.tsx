import { render } from "@react-email/components";

import VercelInviteUserEmail from "~/server/emails/teamplates/invite-to-org";

export default function Page(): JSX.Element {
  const emailHTML = render(
    VercelInviteUserEmail({
      fullName: "Swaraj Bachu",
      userImage: "/profile.jpeg",
      invitedByName: "Swaraj Bachu",
      invitedByEmail: "rajswaraj.@gmail.com",
      teamName: "Aperturs",
      teamImage: "/logo.svg",
      inviteId: "1234",
      inviteFromIp: "string",
      inviteFromLocation: "India",
    }),
  );

  return <div dangerouslySetInnerHTML={{ __html: emailHTML }} />;
}
