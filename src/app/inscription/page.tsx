"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function InscriptionPage() {
  const router = useRouter();
  const [form, setForm] = useState({ nom: "", email: "", password: "" });
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  const soumettre = async () => {
    setChargement(true);
    setErreur("");
    try {
      const res = await fetch("/api/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErreur(data.error ?? "Erreur");
        return;
      }
      // Connexion automatique après inscription
      await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      router.push("/produits");
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-6 py-16">
      <h1 className="font-serif text-2xl mb-8">Créer un compte</h1>
      <div className="space-y-3 mb-6">
        <input
          placeholder="Nom complet"
          className="w-full border rounded px-3 py-2 text-sm"
          value={form.nom}
          onChange={(e) => setForm({ ...form, nom: e.target.value })}
        />
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
        {chargement ? "Création..." : "Créer mon compte"}
      </button>
      <p className="text-sm text-gray-500 mt-4 text-center">
        Déjà un compte ? <a href="/connexion" className="underline">Se connecter</a>
      </p>
    </div>
  );
}
