"use client";

import Link from "next/link";
import { InquiryForm } from "./InquiryForm";
import { Field, AddressGroup, Checkbox } from "./Fields";
import { FileUpload } from "./FileUpload";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs uppercase tracking-[0.18em] text-tungsten">{children}</p>;
}

export function RegisterForm() {
  return (
    <InquiryForm
      type="registration"
      page="register"
      submitLabel="Submit Registration"
      successTitle="Registration received."
      successBody="Thanks — we'll review your details and references and set up your rental account, usually within one business day."
      validate={(p) =>
        p.drivers_license ? null : "Please upload the front of your driver's license and wait for it to finish."
      }
    >
      <Checkbox
        name="policy_agreement"
        required
        label={
          <>
            I have read and agree to the{" "}
            <Link href="/policies" target="_blank" className="text-tungsten hover:underline">
              photospace policies
            </Link>
            .
          </>
        }
      />

      <div className="space-y-5 border-t border-hairline pt-6">
        <SectionLabel>Renter information</SectionLabel>
        <Field label="Organization / company (optional)" name="organization" autoComplete="organization" />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" name="name" required autoComplete="name" />
          <Field label="Email" name="email" type="email" required autoComplete="email" />
          <Field label="Phone" name="phone" type="tel" required autoComplete="tel" />
        </div>
        <AddressGroup label="Billing address (must match your credit card)" prefix="billing" required />
      </div>

      <div className="space-y-4 border-t border-hairline pt-6">
        <SectionLabel>Driver&rsquo;s license</SectionLabel>
        <FileUpload
          label="Front of driver's license"
          name="drivers_license"
          required
          hint="To verify identity. PDF or image, up to 15 MB. Stored privately and shared only with our team."
        />
      </div>

      <div className="space-y-5 border-t border-hairline pt-6">
        <SectionLabel>Business reference 1</SectionLabel>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Business name" name="ref1_business" required />
          <Field label="Relationship (e.g. rental house, client)" name="ref1_relationship" />
          <Field label="Contact name" name="ref1_name" />
          <Field label="Contact phone" name="ref1_phone" type="tel" required />
        </div>
        <Field label="Contact email" name="ref1_email" type="email" required />
      </div>

      <div className="space-y-5 border-t border-hairline pt-6">
        <SectionLabel>Business reference 2</SectionLabel>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Business name" name="ref2_business" required />
          <Field label="Relationship (e.g. rental house, client)" name="ref2_relationship" />
          <Field label="Contact name" name="ref2_name" />
          <Field label="Contact phone" name="ref2_phone" type="tel" required />
        </div>
        <Field label="Contact email" name="ref2_email" type="email" required />
      </div>
    </InquiryForm>
  );
}
