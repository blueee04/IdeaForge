export interface Idea {
  id: string;
  title: string;
  description: string;
  field: string;
  noveltyScore: number;
  feasibilityScore?: number; // mapped from backend feasibility
  confidenceScore?: number;
  citations?: Citation[];
  createdAt?: string;
  marketPotential?: string;
  feasibility?: string;
  researchCitations?: string[];
}

export interface Citation {
  title: string;
  authors: string[];
  source: string;
  url: string;
  year: number;
}

export interface Expert {
  id: string;
  name: string;
  role: string;
  field: string;
  avatar: string;
  domainAuthority: number;
  publications: number;
  bio: string;
}

export interface Field {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface UserPreferences {
  role?: "seeker" | "mentor"; // frontend specific state
  fields?: string[]; // frontend specific
  field?: string; // backend mapping
  noveltyLevel: number;
  mode?: "ai" | "expert";
  goal?: string; // backend mapping
}

export type UserRole = "seeker" | "mentor";
