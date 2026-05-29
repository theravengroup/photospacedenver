export type Step = 0 | 1 | 2 | 3;

export const steps: { id: Step; label: string }[] = [
  { id: 0, label: "Your Information" },
  { id: 1, label: "Membership Agreement" },
  { id: 2, label: "Sign" },
  { id: 3, label: "Choose & Pay" },
];

export type Info = {
  firstName: string;
  lastName: string;
  business: string;
  street: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  email: string;
  phone: string;
};

export const blankInfo: Info = {
  firstName: "",
  lastName: "",
  business: "",
  street: "",
  street2: "",
  city: "",
  state: "",
  zip: "",
  email: "",
  phone: "",
};
