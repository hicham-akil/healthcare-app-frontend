const FALLBACK_OFFERS = [
  {
    key: "GRATUIT",
    audience: "MEDECIN",
    nom: "Gratuit",
    prix: 0,
    maxMedecins: 1,
    dureeEssaiJours: 30,
    hasAdminDashboard: false,
    hasStats: false,
    hasRealTimeQueue: false,
    description: "Une offre d'essai pour attirer les medecins independants.",
  },
  {
    key: "CABINET_SOLO",
    audience: "MEDECIN",
    nom: "Cabinet Solo",
    prix: 299,
    maxMedecins: 1,
    dureeEssaiJours: 0,
    hasAdminDashboard: false,
    hasStats: true,
    hasRealTimeQueue: true,
    description: "Pour un medecin qui gere son propre cabinet.",
  },
  {
    key: "CLINIQUE",
    audience: "CLINIQUE",
    nom: "Clinique",
    prix: 799,
    maxMedecins: 999,
    dureeEssaiJours: 0,
    hasAdminDashboard: true,
    hasStats: true,
    hasRealTimeQueue: true,
    description: "Pour les structures avec plusieurs medecins et des admins internes.",
  },
];

const normalizeName = (value) => (value || "").trim().toLowerCase();

export const getRecommendedOfferAudience = (role) => {
  if (role === "CLINIQUE" || role === "CLINIQUE_ADMIN") return "CLINIQUE";
  if (role === "MEDECIN") return "MEDECIN";
  return "MEDECIN";
};

export const inferOfferAudience = (plan) => {
  if (plan?.maxMedecins > 1 || plan?.hasAdminDashboard) return "CLINIQUE";
  return "MEDECIN";
};

export const inferOfferKey = (plan) => {
  const name = normalizeName(plan?.nom);

  if (name.includes("gratuit") || name.includes("free")) return "GRATUIT";
  if (name.includes("solo")) return "CABINET_SOLO";
  if (name.includes("clinique")) return "CLINIQUE";
  if (plan?.prix === 0) return "GRATUIT";
  if (plan?.maxMedecins > 1 || plan?.hasAdminDashboard) return "CLINIQUE";
  return "CABINET_SOLO";
};

export const normalizePlanOffer = (plan) => ({
  ...plan,
  key: inferOfferKey(plan),
  audience: inferOfferAudience(plan),
});

export const mergePlansWithFallbacks = (plans = []) => {
  const normalizedPlans = Array.isArray(plans) ? plans.map(normalizePlanOffer) : [];
  const byKey = new Map(normalizedPlans.map((plan) => [plan.key, plan]));

  return FALLBACK_OFFERS.map((fallback) => ({
    ...fallback,
    ...(byKey.get(fallback.key) || {}),
    key: fallback.key,
    audience: (byKey.get(fallback.key) || fallback).audience,
  }));
};

export const getOffersForAudience = (plans, audience) =>
  mergePlansWithFallbacks(plans).filter((offer) => offer.audience === audience);

export const getOfferViewerContext = (user, profileData) => {
  const role = user?.role || null;
  const profileCliniqueId = profileData?.cliniqueId ?? profileData?.clinique?.id ?? null;
  const cliniqueId = user?.cliniqueId ?? profileCliniqueId ?? null;

  if (!role) {
    return {
      audience: "MEDECIN",
      canSwitchAudience: true,
      canApply: true,
      hideOffers: false,
      infoMessage: "Choisissez un type de compte pour comparer les offres disponibles.",
    };
  }

  if (role === "MEDECIN" && cliniqueId) {
    return {
      audience: "MEDECIN",
      canSwitchAudience: false,
      canApply: false,
      hideOffers: true,
      infoMessage: "Votre abonnement est gere par votre clinique. Les offres ne s'appliquent pas a ce compte medecin.",
    };
  }

  if (role === "MEDECIN") {
    return {
      audience: "MEDECIN",
      canSwitchAudience: false,
      canApply: true,
      hideOffers: false,
      infoMessage: "Les comptes medecins independants peuvent choisir uniquement les offres medecin.",
    };
  }

  if (role === "CLINIQUE") {
    return {
      audience: "CLINIQUE",
      canSwitchAudience: false,
      canApply: true,
      hideOffers: false,
      infoMessage: "Les comptes clinique peuvent choisir uniquement les offres clinique.",
    };
  }

  if (role === "CLINIQUE_ADMIN") {
    return {
      audience: "CLINIQUE",
      canSwitchAudience: false,
      canApply: false,
      hideOffers: false,
      infoMessage: "Les admins de clinique peuvent consulter l'offre clinique, mais la souscription doit etre geree par le compte clinique principal.",
    };
  }

  if (role === "PATIENT") {
    return {
      audience: "MEDECIN",
      canSwitchAudience: true,
      canApply: false,
      hideOffers: false,
      infoMessage: "Les offres d'abonnement concernent les medecins et les cliniques, pas les patients.",
    };
  }

  return {
    audience: getRecommendedOfferAudience(role),
    canSwitchAudience: true,
    canApply: false,
    hideOffers: false,
    infoMessage: "Consultez les offres disponibles selon le type de compte.",
  };
};
