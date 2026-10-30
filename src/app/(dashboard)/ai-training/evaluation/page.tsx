"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AiEvaluationRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/ai-training");
  }, [router]);

  return null;
}
