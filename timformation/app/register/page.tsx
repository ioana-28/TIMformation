'use client';

import React, { useState } from "react";
import { createClient } from "@/libs/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Extragem display_name din email
    const display_name = email.split("@")[0];

    // Creează contul FĂRĂ verificare email și setăm display_name în metadata
    const { error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined,
        data: { display_name }, // SET metadata aici
      },
    });

    if (signupError) {
      setError(signupError.message);
      return;
    }

    // Logare imediată după înregistrare
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(loginError.message);
      return;
    }

    // Redirect la homepage
    router.push("/");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0f1c]">
      <div className="w-[350px] p-6 rounded-xl bg-[#111827] shadow-xl border border-[#1f2937]">
        
        <h1 className="text-center text-[#d0e4ff] text-2xl mb-6">Register</h1>

        <form onSubmit={handleRegister} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            required
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-lg bg-[#0d1320] text-white border border-[#1e293b]"
          />

          <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-lg bg-[#0d1320] text-white border border-[#1e293b]"
          />

          <button
            type="submit"
            className="p-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white mt-2"
          >
            Creează cont
          </button>
        </form>

        {error && <p className="text-red-500 text-center mt-3">{error}</p>}

        <p className="mt-6 text-center text-[#d0e4ff]">
          Ai deja cont?{" "}
          <Link href="/login" className="text-blue-400 underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
