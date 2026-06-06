import { describe, expect, it } from "vitest";
import {
  getOffersForAudience,
  getOfferViewerContext,
  getRecommendedOfferAudience,
  inferOfferAudience,
  mergePlansWithFallbacks,
} from "../utils/offers";

describe("offers logic", () => {
  it("recommends clinique audience for clinic roles", () => {
    expect(getRecommendedOfferAudience("CLINIQUE")).toBe("CLINIQUE");
    expect(getRecommendedOfferAudience("CLINIQUE_ADMIN")).toBe("CLINIQUE");
  });

  it("infers clinique offers from multi-medecin or admin plans", () => {
    expect(inferOfferAudience({ maxMedecins: 5, hasAdminDashboard: false })).toBe("CLINIQUE");
    expect(inferOfferAudience({ maxMedecins: 1, hasAdminDashboard: true })).toBe("CLINIQUE");
  });

  it("keeps fallback offers when backend plans are missing", () => {
    const offers = mergePlansWithFallbacks([]);
    expect(offers.map((offer) => offer.key)).toEqual(["GRATUIT", "CABINET_SOLO", "CLINIQUE"]);
  });

  it("returns only medecin offers for medecin audience", () => {
    const offers = getOffersForAudience([], "MEDECIN");
    expect(offers.every((offer) => offer.audience === "MEDECIN")).toBe(true);
    expect(offers).toHaveLength(2);
  });

  it("hides all offers for a medecin attached to a clinique", () => {
    const context = getOfferViewerContext({ role: "MEDECIN", cliniqueId: 9 }, null);
    expect(context.hideOffers).toBe(true);
    expect(context.canApply).toBe(false);
    expect(context.canSwitchAudience).toBe(false);
  });

  it("locks solo medecin accounts to medecin offers only", () => {
    const context = getOfferViewerContext({ role: "MEDECIN", cliniqueId: null }, null);
    expect(context.audience).toBe("MEDECIN");
    expect(context.canApply).toBe(true);
    expect(context.canSwitchAudience).toBe(false);
  });

  it("prevents clinique admins from applying to offers", () => {
    const context = getOfferViewerContext({ role: "CLINIQUE_ADMIN", cliniqueId: 7 }, null);
    expect(context.audience).toBe("CLINIQUE");
    expect(context.canApply).toBe(false);
    expect(context.hideOffers).toBe(false);
  });
});
