/**
 * Studio membership agreement clauses + US states for the /memberships/apply
 * flow. Legal text is the photospace membership agreement (same business as
 * photospace.studio) — kept verbatim. Update only with owner/legal sign-off.
 */

export type AgreementClause = { id: string; title: string; body: string };

export const AGREEMENT_CLAUSES: AgreementClause[] = [
  {
    id: "liability",
    title: "Liability & Risk Assumption",
    body:
      "Member assumes the risk of loss, damage or destruction of any and all equipment, supplies, artworks, or other properties in any studio or lifestyle space. Member shall be responsible for any personal injury or property damage to resident or third party arising out of or in connection with Member's use of photospace studio, lifestyle space and/or equipment. Member agrees to make no claim against, and to indemnify and hold harmless photospace, their officers, directors, and employees from any claim by Member or any third party for personal injury or property damage arising out of or in connection with Member's use of photospace studio, lifestyle space and/or equipment.",
  },
  {
    id: "compliance",
    title: "Compliance & Conduct",
    body:
      "Member and persons invited by Member shall, at all times, comply with all Federal, State and local statutes, regulations, ordinances and other laws, and all photospace rules and policies while in the photospace studio or lifestyle space, and to cover Member's potential liability for personal injury or property damage under term of membership and during use of photospace studio, lifestyle space and/or equipment. This agreement is in force for current and all future uses until both parties agree to change it.",
  },
  {
    id: "payment",
    title: "Payment Terms",
    body:
      "First month payment is required upon signup. Minimum membership is 90 days. Monthly payments are automatically charged to the card on file every 30 days. If photospace does not receive payment within 3 days of the renewal date, the agreement is terminated and the final payment remains an open invoice that will be sent to collections after 45 days unpaid.",
  },
  {
    id: "additional-fees",
    title: "Additional Fees",
    body:
      "Member acknowledges that there are some potential additional fees that may be applied, in the event that the cyc wall needs to be repainted or repaired after your shoot, or if the equipment or studio needs to be repaired or rearranged back to its standard configuration. If the gear is put back where it belongs and there is no damage to anything at the end of your shoot, there are no additional fees.",
  },
  {
    id: "scheduling",
    title: "Rental Scheduling",
    body:
      "Rental times can be scheduled anytime online prior to the end of the photographer's monthly cycle. Hours can be used different days throughout the month. Hours do not roll over to the next month. Time is forfeited if not used within the month's cycle. Photographer will need to reserve desired studio times at his/her own convenience. Studio time is reserved on a first come, first served basis. Please include the time you need to set up for your session in your reservation, including time needed for breakdown.",
  },
  {
    id: "insurance",
    title: "Insurance Requirement",
    body:
      "Member will obtain their own insurance as per the photospace policy requirements and supply a Certificate of Insurance to photospace.",
  },
  {
    id: "cancellation",
    title: "Cancellation Policy",
    body:
      "If you cancel or reschedule less than 24 hours before the session time, or do not appear (no-show) for your reserved session, your scheduled appointment hours will be deducted from your monthly usage allowance. If further no-shows or late cancellations occur, photospace reserves the right to not make any further appointments, and cancellation of your membership could result and Member will lose the payment made. Please note that photospace has a strict NO REFUNDS POLICY. We reserve the studio facility to only one client at a time. Once we reserve specific studio time for you, we turn down other clients that might need that time. All fees and policies are non-negotiable.",
  },
  {
    id: "termination",
    title: "Termination & Non-Refundable",
    body:
      "photospace reserves the right to terminate this agreement upon violation of this agreement; photographer must remove all belongings immediately if terminated. This contract runs for three months. Memberships are non-refundable and non-transferable.",
  },
  {
    id: "house-rules",
    title: "House Rules",
    body:
      "1. No Drama. A serious no-tolerance policy for petty grievances. 2. Be Safe. It is your responsibility to know and apply safety rules and guidelines. 3. Be Responsible. Respect and show proper usage of facilities and equipment. 4. Be Tidy. Pick up after yourself, especially in shared areas. 5. Show Respect. Consider other renters, their space, health, sanity, and property. Discard paper and trash in designated bins. Turn off lights and secure the facility upon departure. Non-members are strictly prohibited from using your codes. 6. You are responsible for the security and safety of your belongings. 7. No toxic, harmful, or strong-odor chemicals; no open flames (candles, torches, incense); no smoking or illegal drug use anywhere in the building. 8. If you stay longer than the time reserved (and no one is scheduled after you), payment at the membership hourly rate is due within 10 days. 9. Include set-up, makeup, and wardrobe time in your reservation. 10. After each use, sweep the floor, mop up, and return lights, cables, grip, and production gear to their designated areas. After each cyc-wall use, wipe down and remove dirt and scuffs (cleaner and Mr. Clean Magic Erasers provided). 11. No alcohol, drugs, or smoking. You may not engage in any activity at photospace under the influence. 12. No weapons without written consent from photospace staff. 13. No pornography or audio of explicit sexual acts. 14. No misconduct — nuisance, mistreatment of staff, illegal activity, or destruction of property. 15. Animals require written consent and a dedicated handler. 16. Minors under 18 must have a parent/guardian with them at all times. 17. Messy shoots (glitter, oil, water, mud, food, snow, etc.) must be pre-approved by photospace staff. Additional cleanup fees may apply.",
  },
  {
    id: "legal",
    title: "Legal Provisions",
    body:
      "Attorney's Fees: In the event of any breach, the party responsible agrees to pay reasonable attorneys' fees and costs incurred by the other party in enforcement of this agreement. The prevailing party in any suit will be entitled to recover reasonable attorneys' fees and costs. Governing Law: This agreement shall be governed by the laws of the State of Colorado. Provisions may be amended only in writing and signed by both an authorized photospace representative and Member. Surveillance: The studio space and lifestyle spaces have surveillance cameras installed in several places for security purposes; please alert your clients. Equal Opportunity: photospace seeks, enrolls, and maintains memberships without regard to race, religion, marital status, sex, or sexual orientation.",
  },
];

export const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA",
  "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT",
  "VA", "WA", "WV", "WI", "WY", "DC",
];
