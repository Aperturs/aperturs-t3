import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import { useState } from "react";

const Home: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const { mutateAsync: registeruser } = api.user.registerUser.useMutation();
  const register = () => {
    registeruser({ email: email, password: password }).then((res) => {
      console.log(res);
    });
  };
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">

          <input
            value={email}
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            value={password}
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={register}>Register</button>
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {hello.data ? hello.data.greeting : "Loading tRPC query..."}
            </p>
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: session } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: session?.user !== undefined }
  );
  const { mutateAsync } = api.tweet.scheduleTweets.useMutation();
  const makeTweet = async () => {
    await mutateAsync({
      tweets: [
        {
          scheduled_at: "5:48:00 PM",
          text: "hello from tRPC",
        },
        {
          scheduled_at: "5:49:00 PM",
          text: "hello2 from tRPC",
        },
      ],
    });
  };
  if (session) {
    return (
      <>
        Signed in
        <br />
        <button onClick={() => signOut()}>Sign out</button>
        <button onClick={makeTweet}> makkk ke tweet</button>
      </>
    );
  }

  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
      <button onClick={() => signIn("twitch")}>Sign In twitter</button>
    </>
  );
};
