export const locales = ["en", "ru", "de", "fr", "es", "it", "pl", "pt"] as const;
export type Locale = (typeof locales)[number];

export const pages = ["work", "open-source", "services", "experience", "about", "contact"] as const;
export type PageSlug = (typeof pages)[number];

export type CaseStudy = {
  label: string;
  title: string;
  summary: string;
  context: string;
  responsibility: string;
  approach: string;
  outcome: string;
  stack: string;
};

export type Service = {
  title: string;
  signal: string;
  action: string;
  format: string;
};

export type Role = {
  period: string;
  company: string;
  title: string;
  summary: string;
  evidence: string;
};

export type SiteCopy = {
  localeName: string;
  seo: Record<PageSlug | "home", { title: string; description: string }>;
  nav: Record<PageSlug | "home", string>;
  common: {
    role: string;
    location: string;
    availability: string;
    menu: string;
    language: string;
    close: string;
    skip: string;
    selectedEvidence: string;
    discuss: string;
    exploreWork: string;
    downloadCv: string;
    viewOpenSource: string;
    viewServices: string;
    readArticle: string;
    visitGithub: string;
    visitPub: string;
    finalTitle: string;
    finalBody: string;
    contactDenis: string;
    external: string;
    current: string;
  };
  home: {
    titleLead: string;
    titleEmphasis: string;
    intro: string;
    proof: Array<{ value: string; label: string }>;
    mandateLabel: string;
    mandateTitle: string;
    mandateBody: string;
    workLabel: string;
    workTitle: string;
    workIntro: string;
    servicesLabel: string;
    servicesTitle: string;
    servicesIntro: string;
    openLabel: string;
    openTitle: string;
    openIntro: string;
    careerLabel: string;
    careerTitle: string;
    careerIntro: string;
    principlesLabel: string;
    principlesTitle: string;
    principles: string[];
  };
  work: {
    title: string;
    intro: string;
    labels: { context: string; responsibility: string; approach: string; outcome: string; stack: string };
    cases: CaseStudy[];
    nda: string;
  };
  openSource: {
    title: string;
    intro: string;
    versionLabel: string;
    proof: Array<{ value: string; label: string }>;
    problemTitle: string;
    problemBody: string;
    engineTitle: string;
    engineBody: string;
    coverageTitle: string;
    coverage: string[];
    migrationTitle: string;
    migrationBody: string;
    demoTitle: string;
    demoBody: string;
    relatedTitle: string;
    relatedBody: string;
    writingTitle: string;
    articleTitle: string;
    articleDescription: string;
  };
  services: {
    title: string;
    intro: string;
    labels: { signal: string; action: string; format: string };
    items: Service[];
    boundaryTitle: string;
    boundaryBody: string;
  };
  experience: {
    title: string;
    intro: string;
    roles: Role[];
    educationTitle: string;
    educationBody: string;
    languagesTitle: string;
    languagesBody: string;
  };
  about: {
    title: string;
    intro: string;
    paragraphs: string[];
    usefulTitle: string;
    usefulItems: string[];
    nowTitle: string;
    nowBody: string;
  };
  contact: {
    title: string;
    intro: string;
    directTitle: string;
    response: string;
    formTitle: string;
    formIntro: string;
    name: string;
    email: string;
    company: string;
    need: string;
    budget: string;
    timeline: string;
    optional: string;
    send: string;
    prepared: string;
    privacy: string;
    errors: { name: string; email: string; need: string };
    budgetOptions: string[];
    timelineOptions: string[];
  };
};

