"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirecionar imediatamente para a nova página
    router.replace("/presentation-maker");
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">🎯 Redirecionando...</h1>
        <p className="text-gray-600">Você será redirecionado em instantes...</p>
      </div>
    </div>
  );
}
