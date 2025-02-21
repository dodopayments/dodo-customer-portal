"use client";

import React, { useEffect, useState } from "react";
import PageHeader from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { fetchUser, UserResponse } from "@/redux/slice/user/userSlice";
import { useAppDispatch } from "@/hooks/redux-hooks";
import Loading from "@/components/loading";

const Page = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<UserResponse | null>(null);
  useEffect(() => {
    const fethcData = async () => {
      try {
        setIsLoading(true);
        const response = await dispatch(fetchUser()).unwrap();
        setUser(response);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fethcData();
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
        <Loading />
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-12 py-4 md:py-6 flex flex-col h-full">
      <PageHeader title="Profile" description="View your profile information" />
      <Separator className="my-6" />
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>FirstName</Label>
            <Input disabled value={user?.name?.split(" ")[0] || ""} />
          </div>
          <div className="space-y-2">
            <Label>Last Name</Label>
            <Input disabled value={user?.name?.split(" ")[1] || ""} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input disabled value={user?.phone_number || ""} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input disabled value={user?.email || ""  } />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
