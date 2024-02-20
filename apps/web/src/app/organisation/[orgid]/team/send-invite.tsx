"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { Button } from "@aperturs/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@aperturs/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@aperturs/ui/form";
import { Input } from "@aperturs/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@aperturs/ui/select";

import { DialogClose } from "@aperturs/ui/components/ui/dialog";
import SimpleLoader from "~/components/custom/loading/simple-loading";
import { api } from "~/trpc/react";

interface SendInvitationProps {
  agencyId: string;
}

const SendInvitation: React.FC<SendInvitationProps> = ({ agencyId }) => {
  const userDataSchema = z.object({
    email: z.string().email(),
    role: z.enum(["ADMIN", "EDITOR", "MEMBER"]),
    name: z.string(),
  });
  const form = useForm<z.infer<typeof userDataSchema>>({
    resolver: zodResolver(userDataSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      role: "MEMBER",
      name: "",
    },
  });
  const { mutateAsync: inviteUser } =
    api.organisation.team.inviteUserToOrganisation.useMutation();

  const onSubmit = async (values: z.infer<typeof userDataSchema>) => {
    try {
      const res = await inviteUser({
        name: values.name,
        email: values.email,
        role: values.role,
        orgId: agencyId,
      });
      // await saveActivityLogsNotification({
      //   agencyId: agencyId,
      //   description: `Invited ${res.email}`,
      //   subaccountId: undefined,
      // })
      toast("Invitation sent", { icon: "🚀" });
    } catch (error) {
      console.log(error);
      toast("Failed to send invitation", { icon: "🔥" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invitation</CardTitle>
        <CardDescription>
          An invitation will be sent to the user. Users who already have an
          invitation sent out to their email, will not receive another
          invitation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>User role</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user role..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="EDITOR">Editor</SelectItem>
                      <SelectItem value="MEMBER">Member</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogClose asChild>
            <Button disabled={form.formState.isSubmitting} type="submit">
              {form.formState.isSubmitting ? (
                <SimpleLoader />
              ) : (
                "Send Invitation"
              )}
            </Button>
            </DialogClose>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SendInvitation;
