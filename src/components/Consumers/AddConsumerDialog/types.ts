export type ConsumerFormData = {
  name: string;
  type: "residential" | "commercial" | "industrial";
  consumption: number;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  contact_person: string;
  email: string;
  phone: string;
  vat_number: string;
  notes: string;
};