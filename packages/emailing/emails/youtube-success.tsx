import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

interface YoutubeSuccessEmailProps {
  youtubeUrl: string;
  title: string;
  description: string;
}

const baseUrl = process.env.VERCEL_URL ? `${process.env.VERCEL_URL}` : "";

export const YoutubeSuccessEmail = ({
  youtubeUrl,
  title,
  description,
}: YoutubeSuccessEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Successfully Posted to Youtube</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#3C5CE8",
                offwhite: "#010101",
                brandDark: "#0B0B0E",
              },
              spacing: {
                0: "0px",
                20: "20px",
                45: "45px",
              },
            },
          },
        }}
      >
        <Body className="bg-offwhite font-sans text-base">
          <Img
            src={`${baseUrl}/logo.svg`}
            width="184"
            height="75"
            alt="Aperutrs Logo"
            className="mx-auto my-20 h-24 w-24 rounded-lg bg-white fill-white text-white"
          />
          <Container className="bg-brandDark p-45 rounded-xl text-white">
            <Heading className="my-0 text-center leading-8">
              Successfully Posted to Youtube 🎉
            </Heading>

            <Img
              src={`${baseUrl}/success-post.svg`}
              width="400"
              height="400"
              className="mx-auto my-20"
            />

            <Section>
              <Row>
                <Text className="text-base my-0">
                <b>Your video with title</b>: {title}
                </Text>
                <Text className="text-base mt-0">
                  <b>and with description</b>: {description}
                </Text>
                <Text className="text-base">
                  has been successfully posted to YouTube. 🎉 Now you can share
                  your video with the world.
                </Text>
              </Row>
            </Section>

            <Section className="text-center">
              <Button
                className="bg-brand rounded-lg px-[18px] py-3 text-white"
                href={youtubeUrl}
              >
                View on YouTube
              </Button>
            </Section>

            <Section className="mt-45"></Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

YoutubeSuccessEmail.PreviewProps = {
    description: "Somedescription here",
    title: "Sometitle here",
    youtubeUrl: "https://www.youtube.com/",
  } as YoutubeSuccessEmailProps;

export default YoutubeSuccessEmail;
