export interface MaidFormData {
  // Personal Info
  helper_id: string;
  fullName: string;
  birthDate: string;
  phone: string;
  birthPlace: string;
  address: string;
  gender: { label: string; value: string };
  nationality: string;
  educationLevel: { label: string; value: string };
  height: string;
  weight: string;
  baseFactor?: { label: string; value: number };

  // Job Info
  jobs: { label: string; value: string }[];
  experienceDescription: string;

  // Files
  avatar: File[];
  healthCertificates: File[];
  password: string;
}
