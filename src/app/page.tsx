"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Homepage from "./Homepage/page";

export default function Home() {
  const router = useRouter();
  const [hasSelectedCharacter, setHasSelectedCharacter] = useState<boolean | null>(null);

  useEffect(() => {
    const selectedCharacter = localStorage.getItem('selectedCharacter');
    if (selectedCharacter) {
      setHasSelectedCharacter(true);
    } else {
      setHasSelectedCharacter(false);
      router.push("/onboarding");
    }
  }, [router]);

  if (hasSelectedCharacter === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (hasSelectedCharacter) {
    return <Homepage />;
  }

  return null;
}