import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  if (!token) {
    redirect("/expired");
  }

  redirect(`/api/auth/validate?token=${encodeURIComponent(token)}`);
}
