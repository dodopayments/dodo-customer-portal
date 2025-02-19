"use client";
import React from "react";
import { useParams } from "next/navigation";

const Page = () => {
  const searchParams = useParams();
  const token = searchParams.token;
  if (!token) {
    return <div>No token</div>;
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Session - {token}</h1>
    </div>
  );
};

export default Page;
