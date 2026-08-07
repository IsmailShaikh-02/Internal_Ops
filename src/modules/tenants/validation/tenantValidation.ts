export type FormErrors = Partial<Record<string, string>>;

export const validateStep = (step: number, form: {
  companyName: string;
  companyEmail: string;
  phone?: string;
  website?: string;
  ownerName: string;
  ownerEmail: string;
  ownerMobile?: string;
  ownerPassword?: string;
  trialDays: string;
  seatLimit: string;
  companyDomain?: string;
  primaryColor?: string;
  secondaryColor?: string;
}): FormErrors => {
  const e: FormErrors = {};
  if (step === 1) {
    if (!form.companyName.trim()) e.companyName = "Company name is required.";
    if (!form.companyEmail.trim()) {
      e.companyEmail = "Company email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.companyEmail)) {
      e.companyEmail = "Enter a valid email address.";
    }
    if (form.phone && !/^\+?[\d\s\-().]{10,20}$/.test(form.phone)) {
      e.phone = "Enter a valid phone number.";
    }
    if (form.website && !/^https?:\/\/.+/.test(form.website)) {
      e.website = "Website must start with http:// or https://";
    }
  }
  if (step === 2) {
    if (!form.ownerName.trim()) e.ownerName = "Owner name is required.";
    if (!form.ownerEmail.trim()) {
      e.ownerEmail = "Owner email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.ownerEmail)) {
      e.ownerEmail = "Enter a valid email address.";
    }
    if (form.ownerMobile && !/^\+?[\d\s\-().]{10,20}$/.test(form.ownerMobile)) {
      e.ownerMobile = "Enter a valid mobile number.";
    }
    if (form.ownerPassword && form.ownerPassword.length < 8) {
      e.ownerPassword = "Password must be at least 8 characters.";
    }
  }
  if (step === 3) {
    const trial = parseInt(form.trialDays);
    if (isNaN(trial) || trial < 0 || trial > 365) e.trialDays = "Trial days must be between 0 and 365.";
    const seats = parseInt(form.seatLimit);
    if (isNaN(seats) || seats < 1 || seats > 10000) e.seatLimit = "Seat limit must be between 1 and 10,000.";
  }
  if (step === 5) {
    if (form.companyDomain && !/^[a-z0-9-]+\.[a-z0-9-.]+$/.test(form.companyDomain)) {
      e.companyDomain = "Enter a valid domain (e.g. acme.internalops.app).";
    }
    if (form.primaryColor && !/^#[0-9a-fA-F]{6}$/.test(form.primaryColor)) {
      e.primaryColor = "Enter a valid hex color (e.g. #2563eb).";
    }
    if (form.secondaryColor && !/^#[0-9a-fA-F]{6}$/.test(form.secondaryColor)) {
      e.secondaryColor = "Enter a valid hex color (e.g. #475569).";
    }
  }
  return e;
};
