"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login"); // Redirect to the login page
  }, [router]);

  return null; // No content needed, as we are redirecting
}
