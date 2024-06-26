import { Card, CardContent, CardHeader } from "@aperturs/ui/card";

export default function Problem() {
  return (
    <section className="flex w-full flex-col items-center justify-center py-24 md:pt-28">
      <h1 className="mt-8 text-balance bg-gradient-to-br py-4 text-center text-2xl font-medium tracking-tight text-transparent text-white sm:text-3xl md:text-4xl lg:text-5xl">
        Tired of managing your social media accounts? and writing same content
        again and again?
      </h1>
      <div className="mt-4 flex md:flex-row flex-col w-full justify-center gap-1">
        <Card className="w-full">
          <CardHeader>
            <h2 className="bg-gradient-to-tr from-red-300 to-red-500 bg-clip-text text-2xl lg:text-3xl font-medium tracking-tight text-transparent ">
              Before using Aperturs
            </h2>
          </CardHeader>
          <CardContent className="font-medium text-red-400">
            <ul>
              <ListItem
                icon="❌"
                text="Writing same content again and again adjusting for different platforms"
              />
              <ListItem
                icon="❌"
                text="Looking for images all over the internet"
              />
              <ListItem icon="❌" text="Posting manually" />
              <ListItem
                icon="❌"
                text="Hurdle managing multiple accounts and post manually to all of them separately"
              />
              <ListItem
                icon="❌"
                text="Collaborating with team on chat, sending content back and forth"
              />
            </ul>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <h2 className="bg-gradient-to-tr from-green-300 to-green-500 bg-clip-text text-2xl lg:text-3xl font-medium tracking-tight text-transparent ">
              After using Aperturs
            </h2>
          </CardHeader>
          <CardContent className="font-medium">
            <ul>
              <ListItem
                icon="✅"
                text="Aperturs automatically adjusts content for different platform"
              />
              <ListItem
                icon="✅"
                text="AI generated images based on your content"
              />
              <ListItem
                icon="✅"
                text="Posting Automatically at desired timings"
              />
              <ListItem
                icon="✅"
                text="Manage multiple accounts at single place and post everywhere at once"
              />
              <ListItem
                icon="✅"
                text="Collaborating with team with different access level and approval system"
              />
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

const ListItem = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <li className="flex items-center gap-2 py-1 md:py-2">
    <span className="text-lg">{icon}</span>
    <p className="text-base md:text-lg">{text}</p>
  </li>
);
