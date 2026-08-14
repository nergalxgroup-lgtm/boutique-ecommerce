import crypto from "crypto";

/**
 * Intégration CMI (Centre Monétique Interbancaire) - passerelle de paiement
 * standard au Maroc, protocole "Est3D" (3D Secure).
 *
 * Étapes :
 * 1. Le client valide sa commande -> on génère un formulaire auto-soumis
 *    vers l'URL de paiement CMI avec les paramètres signés.
 * 2. CMI redirige vers /api/paiement/cmi/retour avec le résultat.
 * 3. On vérifie le hash de retour et on met à jour le statut de la commande.
 *
 * Il faut un compte marchand CMI (contrat avec une banque marocaine) pour
 * obtenir CMI_MERCHANT_ID et CMI_STORE_KEY.
 */

type ParamsCMI = {
  orderId: string;
  montant: number;
  email: string;
};

export function genererFormulaireCMI({ orderId, montant, email }: ParamsCMI) {
  const storeKey = process.env.CMI_STORE_KEY!;
  const clientId = process.env.CMI_MERCHANT_ID!;
  const url = process.env.CMI_URL_PAIEMENT!;
  const okUrl = `${process.env.NEXTAUTH_URL}/api/paiement/cmi/retour`;
  const failUrl = `${process.env.NEXTAUTH_URL}/api/paiement/cmi/retour`;

  const params: Record<string, string> = {
    clientid: clientId,
    oid: orderId,
    amount: montant.toFixed(2),
    currency: "504", // $
    okUrl,
    failUrl,
    email,
    rnd: Date.now().toString(),
    lang: "fr",
    storetype: "3D_PAY",
    trantype: "Auth",
    hashAlgorithm: "ver3",
  };

  // Le hash CMI se calcule sur une liste de champs ordonnée avec la store key
  const hashParams = [
    params.clientid,
    params.oid,
    params.amount,
    params.okUrl,
    params.failUrl,
    params.trantype,
    "999999", // instalment (paiement en 1 fois)
    storeKey,
  ].join("|");

  params.hash = crypto.createHash("sha512").update(hashParams).digest("base64");

  return { url, params };
}

export function verifierRetourCMI(params: Record<string, string>): boolean {
  const storeKey = process.env.CMI_STORE_KEY!;
  const hashRecu = params.HASH;
  // Reconstruction du hash à partir des paramètres reçus, à adapter
  // précisément selon la doc technique CMI fournie par la banque.
  const champs = Object.keys(params)
    .filter((k) => k !== "HASH")
    .sort()
    .map((k) => params[k]);
  const hashCalcule = crypto
    .createHash("sha512")
    .update(champs.join("|") + "|" + storeKey)
    .digest("base64");

  return hashRecu === hashCalcule;
}
