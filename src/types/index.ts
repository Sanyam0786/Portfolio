export interface ContactInfo {
  name: string;
  role: string;
  email: string;
  linkedin: string;
  whatsapp: string;
  github: string;
  formspree: string;
}

export interface EducationItem {
  school: string;
  degree: string;
  period: string;
  notes: string;
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  impact: string;
}

export interface SkillItem {
  name: string;
  icon: string;
  level: string;
}

export interface ProjectDemoStore {
  ios?: string;
  android?: string;
}

export interface ProjectDemo {
  store?: ProjectDemoStore | string;
  web?: string;
  available?: boolean;
}

export interface ProjectChallenge {
  problem: string;
  solution: string;
}

export interface ProjectImpact {
  value: string;
  label: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  role: string;
  description: string;
  tags: string[];
  demo?: ProjectDemo;
  coverColor?: string;
  highlights: string[];
  features: string[];
  challenges: ProjectChallenge[];
  impact: ProjectImpact[];
  coverImage: string;
  screenshots: string[];
  images?: string[];
  github?: string;
}
