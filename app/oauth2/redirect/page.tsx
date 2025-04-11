"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function OAuth2RedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registrationRequired = searchParams.get("registration_required");

  useEffect(() => {
    if (registrationRequired === "true") {
      router.push("/register/social");
    } else {
      router.push("/"); // 로그인 성공
    }
  }, [registrationRequired, router]);

  return <p>처리 중입니다...</p>;
}
