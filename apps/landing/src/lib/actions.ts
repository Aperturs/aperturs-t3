"use server";

export async function submitToWaitlist(email: string, name: string) {
  // Submit to waitlist
  const res = await fetch(
    `https://docs.google.com/forms/d/e/1FAIpQLSemaGZClH1VOplKDUne3mJKao8PAXTHe8jBkUAyiJZJx-4b5w/formResponse?entry.493902245=${name}&entry.1135807562=${email}`,
  );
  if (!res.ok) {
    throw new Error("Failed to submit to waitlist");
  }
  return {
    success: true,
  };
}
