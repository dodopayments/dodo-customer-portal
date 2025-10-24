import PageHeader from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { fetchUser } from "./actions";

export default async function ProfilePage() {
  const user = await fetchUser();

  return (
    <div className="w-full px-4 md:px-12 py-4 md:py-6 mb-16 flex flex-col h-full">
      <PageHeader title="Profile" description="View your profile information" />
      <Separator className="my-6" />
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            readOnly
            className="cursor-default focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
            value={user?.name || ""}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input
              readOnly
              className="cursor-default focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
              value={user?.phone_number || ""}
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              readOnly
              className="cursor-default focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
              value={user?.email || ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
