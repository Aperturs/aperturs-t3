import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

interface InviteUserEmailProps {
  userName: string;
  userImage?: string;
  invitedByName: string;
  teamName: string;
  teamImage?: string;
  inviteUrl: string;
  inviteFromIp?: string;
  inviteFromLocation?: string;
  appLogo: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const InviteUserEmail = ({
  userName,
  userImage,
  invitedByName,
  teamName,
  teamImage,
  inviteUrl,
  inviteFromIp,
  inviteFromLocation,
  appLogo,
}: InviteUserEmailProps) => {
  const previewText = `Join ${invitedByName} on Aperturs `;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white p-4 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src={`https://app.aperturs.com/logo.svg`}
                width="40"
                height="37"
                alt="Vercel"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Join <strong>{teamName}</strong> on <strong>Vercel</strong>
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hello
              <strong> {userName}</strong>,
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              <strong>{invitedByName}</strong> has invited you to the{" "}
              <strong>{teamName}</strong> team on <strong>Aperutrs</strong>.
            </Text>
            <Section>
              <Row>
                <Column align="right">
                  <Img
                    className="rounded-full"
                    src={userImage}
                    width="64"
                    height="64"
                  />
                </Column>
                {/* <Column align="center">
                  <Img
                    src={`${baseUrl}/static/vercel-arrow.png`}
                    width="12"
                    height="9"
                    alt="invited you to"
                  />
                </Column> */}
                <Column align="left">
                  <Img
                    className="rounded-full"
                    src={teamImage}
                    width="64"
                    height="64"
                  />
                </Column>
              </Row>
            </Section>
            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={inviteUrl}
              >
                Join the team
              </Button>
            </Section>
            <Text className="text-[14px] leading-[24px] text-black">
              or copy and paste this URL into your browser:{" "}
              <Link href={inviteUrl} className="text-blue-600 no-underline">
                {inviteUrl}
              </Link>
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              This invite was sent from{" "}
              <span className="text-black">{inviteFromIp}</span> located in{" "}
              <span className="text-black">{inviteFromLocation}</span>. If you
              were not expecting this invitation, you can ignore this email. If
              you are concerned about your account&apos;s safety, please reply
              to this email to get in touch with us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

InviteUserEmail.PreviewProps = {
  userName: "Alan Turing",
  appLogo: `${baseUrl}/static/vercel-logo.png`,
  userImage: `${baseUrl}/static/vercel-user.png`,
  invitedByName: "Alan",
  invitedByEmail: "alan.turing@example.com",
  teamName: "Aperturs",
  teamImage: `${baseUrl}/static/vercel-team.png`,
  inviteUrl: "http://localhost:3000/invite/1234",
  inviteFromIp: "204.13.186.218",
  inviteFromLocation: "São Paulo, Brazil",
} as InviteUserEmailProps;

export default InviteUserEmail;
