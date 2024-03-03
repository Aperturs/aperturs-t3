"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

import { Button } from "@aperturs/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@aperturs/ui/card";

import { api } from "~/trpc/react";

interface InviteCardProps {
  organisationName: string;
  organisationLogo: string;
  orgId: string;
  inviteId: string;
  role: string;
  email: string;
  name: string;
}

export default function InviteCard({
  name,
  organisationName,
  organisationLogo,
  orgId,
  inviteId,
  role,
  email,
}: InviteCardProps) {
  const { isSignedIn, user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { mutateAsync: acceptInvite, isPending: accpeting } =
    api.organisation.team.acceptInvite.useMutation();
  const router = useRouter();

  if (!isSignedIn || !isLoaded) {
    return null;
  }
  const userEmail = user.primaryEmailAddress?.emailAddress;
  const sameEmail = userEmail === email;

  const handleAccept = async () => {
    await toast
      .promise(acceptInvite({ inviteId }), {
        loading: "Accepting Invite",
        success: "Invite Accepted",
        error: "Error Accepting Invite",
      })
      .then(() => {
        router.push(`/organisation/${orgId}/team`);
      });
  };

  if (!sameEmail) {
    return (
      <Card className="dark border-none bg-transparent text-center">
        <CardHeader>
          <h1 className="text-xl font-bold">Oops this invite is not for you</h1>
        </CardHeader>
        <CardContent className=" flex flex-col gap-2">
          <h2 className="text-red-400">
            Please logout and login with the correct email
          </h2>
          {user ? (
            <Button
              variant="secondary"
              className="w-full"
              onClick={async () => {
                await toast.promise(signOut(), {
                  loading: "Signing Out",
                  success: "Signed Out",
                  error: "Error Signing Out",
                });
              }}
            >
              Logout
            </Button>
          ) : (
            <Button>
              <Link href="/sign-in">Log In</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dark border-none bg-transparent text-center">
      <CardHeader className="flex w-full items-center justify-center gap-1">
        <Image
          src={organisationLogo}
          alt={organisationName}
          width={100}
          height={100}
          className="rounded-full"
        />
        <h1 className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 bg-clip-text text-center text-xl font-medium tracking-tight text-transparent md:text-3xl">
          {organisationName}
        </h1>
      </CardHeader>
      <CardContent>
        <h1 className="mt-8 bg-gradient-to-br from-slate-100 to-slate-700 bg-clip-text text-center text-xl font-medium tracking-tight text-transparent md:text-3xl">
          Hello {name} 🎉
        </h1>
        <h3 className="mt-8 bg-gradient-to-br from-slate-100 to-slate-700 bg-clip-text text-center text-lg font-medium tracking-tight text-transparent md:text-xl">
          You have been invited to join <b>{organisationName} </b>on Aperturs as
          a {""}
          {role.toLowerCase()}
        </h3>
      </CardContent>
      <CardFooter className="flex w-full gap-1">
        <Button variant="destructive" className="w-full">
          Reject Invite
        </Button>
        <Button className="w-full" onClick={handleAccept} disabled={accpeting}>
          Accept Invite
        </Button>
      </CardFooter>
    </Card>
  );
}
