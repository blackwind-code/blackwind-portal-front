export const primaryDomainOptions = ["dgist.cloud"] as const;

export type PrimaryDomain = typeof primaryDomainOptions[number];