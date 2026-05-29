"use client";

import { InquiryForm } from "./InquiryForm";
import { Field } from "./Fields";
import { FileUpload } from "./FileUpload";

export function CoiForm() {
  return (
    <InquiryForm
      type="coi"
      page="insurance"
      submitLabel="Submit Certificate"
      successTitle="Certificate received."
      successBody="Thanks — we'll match it to your account and confirm. If anything's missing we'll be in touch."
      validate={(p) => (p.certificate ? null : "Please attach your certificate and wait for the upload to finish.")}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" required autoComplete="name" />
        <Field label="Email" name="email" type="email" required autoComplete="email" />
      </div>
      <Field label="Policy holder (must match your account name)" name="policy_holder" required />
      <Field label="Policy expiration date" name="expiration_date" type="date" required />
      <FileUpload
        label="Certificate of Insurance"
        name="certificate"
        required
        hint="PDF or image, up to 15 MB. Stored privately and shared only with our team."
      />
    </InquiryForm>
  );
}
