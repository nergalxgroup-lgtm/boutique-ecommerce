"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function ConnexionPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  const soumettre = async () => {
    setChargement(true);
    setErreur("");
    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    setChargement(false);
    if (res?.error) {
      setErreur("Email ou mot de passe incorrect");
      return;
    }
    router.push("/produits");
  };

  return (
    <div className="max-w-sm mx-auto px-6 py-16">
      <h1 className="font-serif text-2xl mb-8">Connexion</h1>
      <div className="space-y-3 mb-6">
        <input
          placeholder="Email"
          type="email"
          className="w-full border rounded px-3 py-2 text-sm"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Mot de passe"
          type="password"
          className="w-full border rounded px-3 py-2 text-sm"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
      </div>
      {erreur && <p className="text-red-500 text-sm mb-4">{erreur}</p>}
      <button
        onClick={soumettre}
        disabled={chargement}
        className="w-full bg-black text-white py-3 rounded-md font-medium disabled:opacity-40"
      >
        {chargement ? "Connexion..." : "Se connecter"}
      </button>
      <p className="text-sm text-gray-500 mt-4 text-center">
        Pas de compte ? <a href="/inscription" className="underline">S'inscrire</a>
      </p>
    </div>
  );
}
